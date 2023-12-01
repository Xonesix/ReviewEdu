# def difficulty_rating(input_text):
#     # use the model logic here, hardcoded now
#     return f"2.0"
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# Load the trained model and tokenizer
model_path = "./difficultymodelfiles"  # Replace with your model path
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)

# Ensure model and tokenizer are on the same device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

def difficulty_rating(text):
    # Preprocess the text
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)

    # Move the tensors to the appropriate device
    inputs = {k: v.to(device) for k, v in inputs.items()}

    # Predict
    with torch.no_grad():
        logits = model(**inputs).logits

    # Get the predicted class ID
    predicted_class_id = logits.argmax().item()

    return predicted_class_id

# Example usage:
text = "This class was extremely hard, the exams were not fair at all."
predicted_difficulty = difficulty_rating(text)
print(f"Predicted Difficulty Rating: {predicted_difficulty}")