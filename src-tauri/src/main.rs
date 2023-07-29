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
enum AddToDbResult {
    Success,
    Failure(String),
}
#[tauri::command]
async fn add_to_db(email: String, name: String, created: String, password: String) -> AddToDbResult{
    let salt: [u8; 32] = generate_random_salt();
    let config: Config<'_> = Config::default();
    let password_bytes: &[u8] = password.as_bytes();
    let hashed_password: String = argon2::hash_encoded(password_bytes, &salt, &config).unwrap();
    
    match MySqlPool::connect("mysql://root:qqqqqqqq@127.0.0.1/cooperatic").await {
        Ok(pool) => {
            let query: String = format!("INSERT INTO users (email, name, created, password) VALUES ('{}', '{}', '{}', '{}')", email, name, created, hashed_password);
            match sqlx::query(&query).execute(&pool).await {
                Ok(_) => AddToDbResult::Success,
                Err(err) => AddToDbResult::Failure(err.to_string()),
            }
        }
        Err(err) => AddToDbResult::Failure(err.to_string()),
    }
}

#[derive(serde::Serialize)]
struct AuthenticationResult {
    success: bool,
    error_message: Option<String>,
}
#[tauri::command]
async fn check_if_in_db(email: String, entered_password: String) -> AuthenticationResult {
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
        .invoke_handler(tauri::generate_handler![add_to_db, check_if_in_db])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");


    let _local_window: Result<tauri::Window, tauri::Error> = tauri::WindowBuilder::new(
        &app,
        "login_window",
        tauri::WindowUrl::App("login.html".into()),
        ).title("Login - Cooperatic").decorations(true).inner_size(450.0, 500.0).center().theme(Some(tauri::Theme::Light)).min_inner_size(450.0, 500.0).build();

    app.run(|_, _| {});
}
