use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub enum ActionResult {
    Success,
    Failure(String),
}
