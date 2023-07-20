// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sqlx::MySqlPool;
use tauri::async_runtime::spawn;

#[tauri::command]
fn add_to_db(email: String, name: String, created: String, password: String) {
    spawn(async move {
        if let Err(e) = add_to_db_impl(email.as_str(), name.as_str(), created.as_str(), password.as_str()).await {
            eprintln!("Error: {:?}", e);
        }
    });
}

async fn add_to_db_impl(email: &str, name: &str, created: &str, password: &str) -> Result<(), sqlx::Error> {
    let pool = MySqlPool::connect("mysql://root:qqqqqqqq@127.0.0.1/cooperatic").await?;
    let query = format!("INSERT INTO users (email, name, created, password) VALUES ('{}', '{}', '{}', '{}')", email, name, created, password);
    sqlx::query(&query).execute(&pool).await?;

    Ok(())
}


fn main() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![add_to_db])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");


    let _local_window = tauri::WindowBuilder::new(
        &app,
        "login_window",
        tauri::WindowUrl::App("login.html".into()),
        ).title("Login - Cooperatic").decorations(false).center().theme(Some(tauri::Theme::Light)).build();

    app.run(|_, _| {});
}
