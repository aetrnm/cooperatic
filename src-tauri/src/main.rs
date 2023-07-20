// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sqlx::MySqlPool;
use tauri::async_runtime::spawn;
use argon2::{self, Config};
use rand::{Rng, thread_rng};

fn generate_random_salt() -> [u8; 32] {
    let mut salt: [u8; 32] = [0u8; 32];
    let mut rng: rand::rngs::ThreadRng = thread_rng();
    rng.fill(&mut salt);
    salt
}

#[tauri::command]
fn add_to_db(email: String, name: String, created: String, password: String) {
    let salt: [u8; 32] = generate_random_salt();
    let config: Config<'_> = Config::default();
    let password_bytes: &[u8] = password.as_bytes();
    let hashed_password: String = argon2::hash_encoded(password_bytes, &salt, &config).unwrap();
    
    spawn(async move {
        if let Err(e) = add_to_db_impl(email.as_str(), name.as_str(), created.as_str(), hashed_password.as_str()).await {
            eprintln!("Error: {:?}", e);
        }
    });
}

async fn add_to_db_impl(email: &str, name: &str, created: &str, hashed_password: &str) -> Result<(), sqlx::Error> {
    let pool: sqlx::Pool<sqlx::MySql> = MySqlPool::connect("mysql://root:qqqqqqqq@127.0.0.1/cooperatic").await?;
    let query: String = format!("INSERT INTO users (email, name, created, password) VALUES ('{}', '{}', '{}', '{}')", email, name, created, hashed_password);
    sqlx::query(&query).execute(&pool).await?;

    Ok(())
}


fn main() {
    let app: tauri::App = tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![add_to_db])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");


    let _local_window: Result<tauri::Window, tauri::Error> = tauri::WindowBuilder::new(
        &app,
        "login_window",
        tauri::WindowUrl::App("login.html".into()),
        ).title("Login - Cooperatic").decorations(true).inner_size(400.0, 350.0).center().theme(Some(tauri::Theme::Light)).build();

    app.run(|_, _| {});
}
