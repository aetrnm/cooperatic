// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![greet])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");


    let _local_window = tauri::WindowBuilder::new(
        &app,
        "login_window",
        tauri::WindowUrl::App("login.html".into()),
        ).title("Login - Cooperatic").decorations(true).inner_size(400.0, 350.0).center().theme(Some(tauri::Theme::Light)).build();

    app.run(|_, _| {});
}
