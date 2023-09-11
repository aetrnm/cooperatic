// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod enums;
mod user;
mod group;
mod auth;

use tauri::{Builder, WindowBuilder};

fn main() {
    let app: tauri::App = Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            auth::check_if_user_in_db,
            user::add_user_to_db,
            user::get_id_by_email,
            user::get_groups_by_user_id,
            group::add_group_to_db
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    let _login_window = WindowBuilder::new(
        &app,
        "login_window",
        tauri::WindowUrl::App("login.html".into()),
    )
    .title("Login - Cooperatic")
    .decorations(true)
    .inner_size(450.0, 500.0)
    .center()
    .theme(Some(tauri::Theme::Light))
    .min_inner_size(450.0, 500.0)
    .build();

    app.run(|_, _| {});
}
