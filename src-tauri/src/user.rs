
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
    
    match MySqlPool::connect("mysql://root:qqqqqqqq@127.0.0.1/cooperatic").await {
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

pub async fn get_id_by_email(email: &str) -> Result<String, Box<dyn std::error::Error>> {
    let database_url = "mysql://root:qqqqqqqq@127.0.0.1/cooperatic";
    let pool = MySqlPool::connect(&database_url).await?;
    let query = format!(
        "SELECT id FROM users WHERE email = '{}'",
        email
    );

    let id_result = sqlx::query(&query)
        .bind(email)
        .fetch_optional(&pool)
        .await?;

    let id_string = match id_result {
        Some(row) => row.get::<u64, _>("id").to_string(),
        None => String::new(),
    };

    Ok(id_string)
}
