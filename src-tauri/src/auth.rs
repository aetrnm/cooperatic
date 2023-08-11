use argon2::verify_encoded;
use sqlx::{MySqlPool, Row};

use crate::enums::ActionResult;

pub fn verify_password(entered_password: &str, hashed_password: &str) -> bool {
    match verify_encoded(hashed_password, entered_password.as_bytes()) {
        Ok(matches) => matches,
        Err(_) => false,
    }
}

#[tauri::command]
pub async fn check_if_user_in_db(email: String, entered_password: String) -> ActionResult {
    match MySqlPool::connect("mysql://root:qqqqqqqq@127.0.0.1/cooperatic").await {
        Ok(pool) => {
            let query: String = format!("SELECT password FROM users WHERE email = '{}'", email);
            match sqlx::query(&query).fetch_optional(&pool).await {
                Ok(result) => {
                    match result {
                        Some(record) => {
                            let db_password: String = record.get("password");
                            let password_matches = verify_password(&entered_password, &db_password);
                            if password_matches{
                              ActionResult::Success
                            }
                            else {
                              ActionResult::Failure("Invalid password".to_string())
                            }
                        }
                        None => ActionResult::Failure("User not found".to_string()),
                    }
                }
                Err(err) => ActionResult::Failure(err.to_string()),
            }
        }
        Err(err) => ActionResult::Failure(err.to_string()),
    }
}
