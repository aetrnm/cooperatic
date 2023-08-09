// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sqlx::{MySqlPool, Row};
use argon2::{self, Config};
use rand::{Rng, thread_rng};

fn generate_random_salt() -> [u8; 32] {
    let mut salt: [u8; 32] = [0u8; 32];
    let mut rng: rand::rngs::ThreadRng = thread_rng();
    rng.fill(&mut salt);
    salt
}

#[derive(serde::Serialize)]
enum AddUserToDbResult {
    Success,
    Failure(String),
}
#[tauri::command]
async fn add_user_to_db(email: String, name: String, created: String, password: String) -> AddUserToDbResult{
    let salt: [u8; 32] = generate_random_salt();
    let config: Config<'_> = Config::default();
    let password_bytes: &[u8] = password.as_bytes();
    let hashed_password: String = argon2::hash_encoded(password_bytes, &salt, &config).unwrap();
    
    match MySqlPool::connect("mysql://root:qqqqqqqq@127.0.0.1/cooperatic").await {
        Ok(pool) => {
            let query: String = format!("INSERT INTO users (email, name, creation_date, password) VALUES ('{}', '{}', '{}', '{}')", email, name, created, hashed_password);
            match sqlx::query(&query).execute(&pool).await {
                Ok(_) => AddUserToDbResult::Success,
                Err(err) => AddUserToDbResult::Failure(err.to_string()),
            }
        }
        Err(err) => AddUserToDbResult::Failure(err.to_string()),
    }
}

fn generate_code() -> String {
    let charset: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let mut rng = rand::thread_rng();
    let code: String = (0..6)
        .map(|_| {
            let idx = rng.gen_range(0..charset.len());
            charset[idx] as char
        })
        .collect();
    code
}

async fn get_id_by_email(email: &str) -> Result<String, Box<dyn std::error::Error>> {
    let database_url = "mysql://root:qqqqqqqq@127.0.0.1/cooperatic";
    let pool = MySqlPool::connect(&database_url).await?;
    let query = format!(
        "SELECT id FROM users WHERE email = '{}'",
        email
    );
    println!("HERE2");

    let id_result = sqlx::query(&query)
        .bind(email)
        .fetch_optional(&pool)
        .await?;

    // Extract the id from the id_result and convert it to a String
    let id_string = match id_result {
        Some(row) => row.get::<u64, _>("id").to_string(),
        None => String::new(), // You can customize this to handle the None case
    };

    Ok(id_string)
}


#[derive(serde::Serialize)]
enum AddGroupToDbResult {
    Success,
    Failure(String),
}
#[tauri::command]
async fn add_group_to_db(name: String, created: String, owner_email: String) -> AddGroupToDbResult {
    let code = generate_code();
    println!("HERE");
    let owner_id: String = match get_id_by_email(&owner_email).await {
        Ok(id) => id,
        Err(err) => {
            return AddGroupToDbResult::Failure(err.to_string());
        }
    };
    println!("HERE, {}", owner_id);

    match MySqlPool::connect("mysql://root:qqqqqqqq@127.0.0.1/cooperatic").await {
        Ok(pool) => {
            let group_query: String = format!("INSERT INTO `groups` (group_name, group_code, creation_date) VALUES ('{}', '{}', '{}')", name, code, created);
            match sqlx::query(&group_query).execute(&pool).await {
                Err(err) => return AddGroupToDbResult::Failure(err.to_string()),
                Ok(_) => {
                    let ownership_query = format!("INSERT INTO `groups_ownership` (`group_id`, `owner_id`) VALUES ((SELECT id FROM `groups` WHERE group_code = '{}'), {})", code, owner_id);
                    match sqlx::query(&ownership_query).execute(&pool).await {
                        Err(err) => return AddGroupToDbResult::Failure(err.to_string()),
                        Ok(_) => return AddGroupToDbResult::Success,
                    }
                }
            }
        }
        Err(err) => return AddGroupToDbResult::Failure(err.to_string()),
    }
}


#[derive(serde::Serialize)]
struct AuthenticationResult {
    success: bool,
    error_message: Option<String>,
}

#[tauri::command]
async fn check_if_user_in_db(email: String, entered_password: String) -> AuthenticationResult {
    match MySqlPool::connect("mysql://root:qqqqqqqq@127.0.0.1/cooperatic").await {
        Ok(pool) => {
            let query: String = format!("SELECT password FROM users WHERE email = '{}'", email);
            match sqlx::query(&query).fetch_optional(&pool).await {
                Ok(result) => {
                    match result {
                        Some(record) => {
                            let db_password: String = record.get("password");
                            let password_matches = verify_password(&entered_password, &db_password);
                            AuthenticationResult {
                                success: password_matches,
                                error_message: None,
                            }
                        }
                        None => AuthenticationResult {
                            success: false,
                            error_message: Some("An error occurred :(".to_string()),
                        },
                    }
                }
                Err(err) => AuthenticationResult {
                    success: false,
                    error_message: Some(err.to_string()),
                },
            }
        }
        Err(err) => AuthenticationResult {
            success: false,
            error_message: Some(err.to_string()),
        },
    }
}

fn verify_password(entered_password: &str, hashed_password: &str) -> bool {
    match argon2::verify_encoded(hashed_password, entered_password.as_bytes()) {
        Ok(matches) => matches,
        Err(_) => false,
    }
}

fn main() {
    let app: tauri::App = tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![add_user_to_db, check_if_user_in_db, add_group_to_db])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");


    let _local_window: Result<tauri::Window, tauri::Error> = tauri::WindowBuilder::new(
        &app,
        "login_window",
        tauri::WindowUrl::App("login.html".into()),
        ).title("Login - Cooperatic").decorations(true).inner_size(450.0, 500.0).center().theme(Some(tauri::Theme::Light)).min_inner_size(450.0, 500.0).build();

    app.run(|_, _| {});
}
