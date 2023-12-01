# def clarity_rating(input_text):
#     # use the model logic here, hardcoded now
#     return f"3.0"
from transformers import pipeline
from transformers import AutoModelForSequenceClassification, TrainingArguments, Trainer, DistilBertTokenizer
from transformers import AutoTokenizer

# Assuming your model is saved, load it
model_path = "./claritymodelfiles"
model = AutoModelForSequenceClassification.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained('distilbert-base-uncased')

# Create a pipeline for text classification
classifier = pipeline("text-classification", model=model, tokenizer=tokenizer)

# Your input text
# input_text = "This is the hardest class ever oh my god I want to die!"
# # Preprocess and make predictions
# predictions = classifier(input_text)

# Interpret the output
# difficulty_rating = predictions[0]['label']

def clarity_rating(input_text):
    predictions=classifier(input_text)
    difficulty_rating = predictions[0]['label']

    ## PRINT, remove in demo
    print(difficulty_rating)


    return difficulty_rating
# print("Predicted Difficulty Rating:", difficulty_rating)
# clarity_rating("This is the hardest class ever oh my god I want to die!")
