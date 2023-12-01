import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from transformers import BertTokenizer, BertModel

#NVIDIA
device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')

# M1 MACS
# device = torch.device('mps') if torch.backends.mps.is_available() else torch.device('cpu')

class BERTClass(nn.Module):
    def __init__(self):
        super(BERTClass, self).__init__()
        self.bert_model = BertModel.from_pretrained("bert-base-uncased", return_dict=True)
        self.dropout = nn.Dropout(0.3)
        self.linear = nn.Linear(768, 25)
    def forward(self, input_ids, attention_mask, token_type_ids):
        output = self.bert_model(input_ids, attention_mask, token_type_ids)
        output_dropout = self.dropout(output.pooler_output)
        output = self.linear(output_dropout)
        return output
modelTesting = BERTClass()
modelTesting.to(device)
df = pd.read_csv("https://raw.githubusercontent.com/suvelmuttreja/professor-nlp/main/rmpDataNew.csv")
df.drop('Department', axis=1, inplace=True)
df.drop('First Name', axis=1, inplace=True)
df.drop('Last Name', axis=1, inplace=True)
df.drop('Avg Difficulty', axis=1, inplace=True)
df.drop('Avg Rating', axis=1, inplace=True)
df.drop('Difficulty Rating', axis=1, inplace=True)
df = df[df['Grade'].str.len() <= 3]
df.drop('Grade', axis=1, inplace=True)
df.drop('Clarity Rating', axis=1, inplace=True)


#Drop empty rows with no rating tags

# 3. Split the 'Rating Tags' based on '--' and use one-hot encoding for each tag.
# Split the 'Rating Tags' based on '--' and use one-hot encoding for each tag (case-insensitive).
tags = df['Rating Tags'].str.lower().str.split('--', expand=True).stack()
one_hot_encoded = pd.get_dummies(tags, prefix='Tag').groupby(level=0).sum()
df = pd.concat([df, one_hot_encoded], axis=1)


# 4. Drop rows where the 'Rating Tags' column is empty.
df = df[df['Rating Tags'].notna()]



# 5. Drop rows where the string length in the 'Grade' column is longer than 3.


# 6. DROPPING COMMENTS LESS THAN LENGTH OF 100
df = df[df['Comment'].str.len() >= 100]

df.head()
MAX_LEN = 256
TRAIN_BATCH_SIZE = 16
VALID_BATCH_SIZE = 16
EPOCHS = 2
LEARNING_RATE = 1e-05
old_target_list = ['comment', 'rating tags', 'tag_accessible outside class',
       'tag_amazing lectures', 'tag_amazing lectures ',
       'tag_beware of pop quizzes', 'tag_caring', 'tag_clear grading criteria',
       'tag_extra credit', 'tag_get ready to read', 'tag_gives good feedback',
       'tag_graded by few things', 'tag_group projects', 'tag_hilarious',
       'tag_inspirational', 'tag_lecture heavy', 'tag_lots of homework',
       'tag_online savvy', 'tag_participation matters', 'tag_respected',
       "tag_skip class? you won't pass.", 'tag_so many papers',
       'tag_test heavy', 'tag_tests are tough', 'tag_tests? not many',
       'tag_tough grader', 'tag_would take again']
# target_list = [tag for tag in old_target_list if tag in df.columns]
# print(target_list)
old_target_list = [tag.lower() for tag in old_target_list]

# Filter the tags that are present in the DataFrame columns
target_list = [tag for tag in old_target_list if tag in df.columns]

len(target_list)
df[target_list].values[:, 2:]

# Initialize and load BERT Model
model = BERTClass()
model.load_state_dict(torch.load(r'.\ReviewEdu\server\TheFinalOne.pt', map_location=device))
model.to(device)
model.eval()
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

def tags(text):
  example = text
  encodings = tokenizer.encode_plus(
            example,
            None,
            add_special_tokens=True,
            max_length=MAX_LEN,
            padding='max_length',
            return_token_type_ids=True,
            truncation=True,
            return_attention_mask=True,
            return_tensors='pt'
        )

  model.eval()

  with torch.no_grad():
    ids = encodings['input_ids'].to(device, dtype = torch.long)
    mask = encodings['attention_mask'].to(device, dtype = torch.long)
    token_type_ids = encodings['token_type_ids'].to(device, dtype = torch.long)
    output = model(ids, mask, token_type_ids)
    final_output = torch.sigmoid(output).cpu().detach().numpy().tolist()[0]
    tags = df.columns[2:].to_list()

    tags_assigned = [tag for tag, value in zip(tags, final_output) if value > 0.2]
    print("highest probability")
    print(tags_assigned)

    print("top 3")
    top_indices = np.argsort(final_output)[-3:][::-1].tolist()

    # Get the corresponding tags
    top_tags = [tags[i] for i in top_indices]
    print(top_tags)
    return top_tags