use sqlx::{MySqlPool, Row};    
use crate::enums::ActionResult;
use argon2::{self, Config};
use rand::{Rng, thread_rng};

pub fn generate_random_salt() -> [u8; 32] {
  let mut salt: [u8; 32] = [0u8; 32];
  let mut rng: rand::rngs::ThreadRng = thread_rng();
  rng.fill(&mut salt);
  salt
}

#[tauri::command]
pub async fn add_user_to_db(email: String, name: String, created: String, password: String) -> ActionResult {
    let salt: [u8; 32] = generate_random_salt();
    let config: Config<'_> = Config::default();
    let password_bytes: &[u8] = password.as_bytes();
    let hashed_password: String = argon2::hash_encoded(password_bytes, &salt, &config).unwrap();
    
    match MySqlPool::connect("mysql://root:=Z6&pcj1VM@127.0.0.1/cooperatic").await {
        Ok(pool) => {
            let query: String = format!("INSERT INTO users (email, name, creation_date, password) VALUES ('{}', '{}', '{}', '{}')", email, name, created, hashed_password);
            match sqlx::query(&query).execute(&pool).await {
                Ok(_) => ActionResult::Success,
                Err(err) => ActionResult::Failure(err.to_string()),
            }
        }
        Err(err) => ActionResult::Failure(err.to_string()),
    }
}

#[tauri::command]
pub async fn get_id_by_email(email: &str) -> Result<String, String> {
    let database_url = "mysql://root:=Z6&pcj1VM@127.0.0.1/cooperatic";
    let pool = MySqlPool::connect(&database_url).await;
    
    match pool {
        Ok(pool) => {
            let query = format!("SELECT id FROM users WHERE email = '{}'", email);
    
            match sqlx::query(&query)
                .bind(email)
                .fetch_optional(&pool)
                .await
            {
                Ok(id_result) => {
                    let id_string = match id_result {
                        Some(row) => row.get::<u64, _>("id").to_string(),
                        None => String::new(),
                    };
                    Ok(id_string)
                }
                Err(err) => Err(err.to_string()),
            }
        }
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
pub async fn get_groups_by_user_id(user_id: u64) -> Result<Vec<u64>, ActionResult> {
    let database_url = "mysql://root:=Z6&pcj1VM@127.0.0.1/cooperatic";

    if let Ok(pool) = MySqlPool::connect(&database_url).await {
        let query = format!("SELECT group_id FROM `users_groups` WHERE user_id = '{user_id}'");

        if let Ok(rows) = sqlx::query(&query)
            .bind(user_id)
            .fetch_all(&pool)
            .await
        {
            let groups: Vec<u64> = rows.iter().map(|row| row.get("group_id")).collect();

            Ok(groups)
        } else {
            Err(ActionResult::Failure("Failed to execute the query.".to_string()))
        }
    } else {
        Err(ActionResult::Failure("Failed to connect to the database.".to_string()))
    }
}