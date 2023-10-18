use crate::user::get_id_by_email;
use sqlx::MySqlPool;
use crate::enums::ActionResult;
use rand::Rng;

pub fn generate_code() -> String {
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

#[tauri::command]
pub async fn add_group_to_db(name: String, created: String, owner_email: String) -> ActionResult {
    let code = generate_code();
    let owner_id: String = match get_id_by_email(&owner_email).await {
        Ok(id) => id,
        Err(err) => {
            return ActionResult::Failure(err.to_string());
        }
    };

    match MySqlPool::connect("mysql://root:=Z6&pcj1VM@127.0.0.1/cooperatic").await {
        Ok(pool) => {
            let group_query: String = format!("INSERT INTO `groups` (group_name, group_code, creation_date) VALUES ('{}', '{}', '{}')", name, code, created);
            match sqlx::query(&group_query).execute(&pool).await {
                Err(err) => return ActionResult::Failure(err.to_string()),
                Ok(_) => {
                    let ownership_query = format!("INSERT INTO `groups_ownership` (`group_id`, `owner_id`) VALUES ((SELECT id FROM `groups` WHERE group_code = '{}'), {})", code, owner_id);
                    match sqlx::query(&ownership_query).execute(&pool).await {
                        Err(err) => return ActionResult::Failure(err.to_string()),
                        Ok(_) => {
                            let user_group_query = format!("INSERT INTO `users_groups` (`user_id`, `group_id`) VALUES ({}, (SELECT id FROM `groups` WHERE group_code = '{}'))", owner_id, code);
                            match sqlx::query(&user_group_query).execute(&pool).await {
                                Err(err) => return ActionResult::Failure(err.to_string()),
                                Ok(_) => return ActionResult::Success,
                            }
                        }
                    }
                }
            }
        }
        Err(err) => return ActionResult::Failure(err.to_string()),
    }
}
