---
title: "test"
excerpt: "This project was done to showcase the usage of the Transformer Language Models and their comprehensive usage nowadays. These kind of models can be used (as shown in the project) for text classification, text translation, question an answer and text translation, features that can be invaluable in a world where the Communication (especially in business like Customer Service) is a decisive strategy point.<br/><img src='/images/car.jpeg'>"
collection: portfolio
hide_footer: true
toc: true
toc_sticky: true
---

# Transformers and Language Models to understand Car Reviews

![](car.jpeg)

An auto dealership company for car sales and rental is taking their services to the next level thanks to **Large
Language Models (LLMs)**.

In this scenario, we have been asked to
prototype a chatbot app with multiple functionalities that not only
assist customers but also provide support to human agents in the
company.

The solution should receive textual prompts and use a variety of
pre-trained Hugging Face LLMs to respond to a series of tasks,
e.g. classifying the sentiment in a car’s text review, answering a
customer question, summarizing or translating text, etc.

## Install Necessary Libraries

Before you start, ensure you have the necessary libraries installed. You can install them using the following commands:

Note: The packages' versions are these ones:

- transformers==4.45.2
- pandas==2.2.2
- evaluate==0.4.2

```{python}
#!pip install --user -r requirements.txt
```

We’ll first start loading the data from the dataset `car_reviews.csv`

```{python}
# Loading the packages which will be used here
import pandas as pd
from transformers import logging, AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import evaluate
import transformers

logging.set_verbosity(logging.WARNING)
# Specify the file path to the dataset
file_path = "data/car_reviews.csv"

# Read the dataset into a DataFrame
df = pd.read_csv(file_path, delimiter=";")

# Display the first few rows of the DataFrame
df.head()
```

## Sentiment Analysis

Sentiment Analysis Sentiment analysis is the process of determining the
emotional tone behind a series of words. It is used to gain an
understanding of the attitudes, opinions, and emotions expressed within
an online mention. In this section, we will use a pre-trained model to
classify the sentiment of car reviews.

We will use the `distilbert-base-uncased-finetuned-sst-2-english` model
from Hugging Face, which is a fine-tuned version of DistilBERT for
sentiment analysis.

```{python}
# Running the sentiment classification
classifier = pipeline('sentiment-analysis', model='distilbert-base-uncased-finetuned-sst-2-english')

# Perform inference on the car reviews and display prediction results
reviews = df.Review.to_list()
real_labels = df.Class.to_list()
predicted_labels = classifier(reviews)
for review, prediction, label in zip(reviews, predicted_labels, real_labels):
    print(f"Review: {review}\nActual Sentiment: {label}\nPredicted Sentiment: {prediction['label']} (Confidence: {prediction['score']:.4f})\n")

# Load accuracy and F1 score metrics
accuracy = evaluate.load('accuracy')
f1 = evaluate.load('f1')

# Map categorical sentiment labels into integer labels
references = [1 if label == "POSITIVE" else 0 for label in real_labels]
predictions = [1 if label['label'] == "POSITIVE" else 0 for label in predicted_labels]

# Calculate accuracy and F1 score
accuracy_result_dict = accuracy.compute(references=references, predictions=predictions)
accuracy_result = accuracy_result_dict['accuracy']
f1_result_dict = f1.compute(references=references, predictions=predictions)
f1_result = f1_result_dict['f1']
print(f"Accuracy: {accuracy_result}")
print(f"F1 result: {f1_result}")
```

In this case, we used accuracy and f1 formulas, which are denoted by:

![](accuracy.png)


These metrics are chosen to ensure we can evaluate the model's overall classification performance (accuracy) and account for the varying presence of different classes (weighted metrics).

As we can see, an accuracy of 0.8 or 80% means that the model has a good result in classifying the classes, while an F1 score of 0.857 (85.7%) indicates that the model was accurate in predicting without being biased towards any particular class.

## Translation

Text translation is the process of converting text from one language to
another. In this section, we will use a pre-trained model to translate
car reviews from Spanish to English.

We will use the `Helsinki-NLP/opus-mt-es-en` model from Hugging Face,
which is a machine translation model trained on the OPUS corpus.

```{python}
# Load model directly
translator = pipeline("translation", model="Helsinki-NLP/opus-mt-es-en", truncate=True)

# Filtering the data to be translated
data_to_translate = df.Review.iloc[0]
data_to_translate

# Selecting only the first two sentences
sentences = data_to_translate.split(".")
first_two_sentences = sentences[:2]
data_to_translate = ".".join(first_two_sentences)

translator = pipeline("translation", model="Helsinki-NLP/opus-mt-en-es")
translated_review = translator(data_to_translate)[0]['translation_text']

# Loading BLEU metric
bleu = evaluate.load('bleu')

# Loading the reference translations
reviews_es = pd.read_csv('data/reference_translations.txt', names=['reviews'])
reviews_es = list(reviews_es.reviews.values)

# Calculating BLEU score
for review in reviews_es:
    print(f"Translated: {translated_review}")
    print(f"Original: {review}")
    bleu_score = bleu.compute(references=[review], predictions=[translated_review])
    print(f"Bleu Score: {bleu_score['bleu']}")
    print()
```

## BLEU Score

The BLEU (Bilingual Evaluation Understudy) score is a metric for evaluating a generated sentence to a reference sentence. It is used to measure the quality of text which has been machine-translated from one language to another. The BLEU score ranges from 0 to 1, where 1 indicates a perfect match between the generated and reference sentences.

### BLEU Score Formula

The BLEU score is calculated using the following formula:

$$
\text{BLEU} = \text{BP} \cdot \exp \left( \sum_{n=1}^{N} w_n \log p_n \right)
$$

Where:

- \( BP \) is the brevity penalty, which penalizes short translations.

- \( w_n \) is the weight for n-gram precision (usually uniform weights are used).

- \( p_n \) is the precision for n-grams.

### Interpretation of BLEU Score

A BLEU score of 0.6712 indicates that the translated text is fairly close to the reference text. Higher BLEU scores indicate better translations, with a score of 1 being a perfect match. However, it is important to note that BLEU scores are not always indicative of translation quality, as they do not account for synonyms or the overall fluency of the translation.

## Question Answering

Question answering (QA) is the task of automatically answering a
question posed in natural language. In this section, we will use a
pre-trained model to answer questions about car reviews.

We will use the `deepset/minilm-uncased-squad2` model from Hugging Face,
which is a fine-tuned version of MiniLM for question answering on the
SQuAD2.0 dataset.

```{python}
# Loading the model for QA
model_name_QA = "deepset/minilm-uncased-squad2"

model = transformers.AutoModelForQuestionAnswering.from_pretrained(model_name_QA)
tokenizer = transformers.AutoTokenizer.from_pretrained(model_name_QA)

# Defining the question
question = "What did he like about the brand?"

# Selecting the 2nd review in the dataset
context = df['Review'][1]

# Tokenizing the inputs and returning PyTorch tensors
import torch
inputs = tokenizer.encode(question, context, return_tensors='pt')

with torch.no_grad():
    output = model(inputs)

# Catching the highest logits, which means the highest probability of the tokens for the beginning and for the end
start = torch.argmax(output.start_logits)
end = torch.argmax(output.end_logits) + 1

# Filtering the tokenized text for the highest probable tokens
answer_span = inputs[0][start:end]

# Translating the answer for human-readable format
answer = tokenizer.decode(answer_span)
print(f"Main terms at the answer = {answer}")
```


### Question Answering Results

In this section, we used the `deepset/minilm-uncased-squad2` model to answer questions about car reviews. The model was able to extract relevant information from the reviews to answer the posed questions.

For example, when asked "What did he like about the brand?" in the context of the second review, the model provided the answer: "ride quality, reliability".

This demonstrates the model's ability to understand and extract specific information from the text, which can be useful for various applications such as customer support and information retrieval.

## Text Summarization

Text summarization is the task of creating a short, accurate, and fluent
summary of a longer text document. In this section, we will use a
pre-trained model to summarize the last review in our dataset.

We will use the `Falconsai/text_summarization` model from Hugging Face,
which is a model specifically designed for text summarization tasks.

```{python}
# Load the pre-trained tokenizer and model for text summarization
tokenizer = AutoTokenizer.from_pretrained("Falconsai/text_summarization")
model = AutoModelForSeq2SeqLM.from_pretrained("Falconsai/text_summarization")

# Extract the last review text from the DataFrame
text = df['Review'].iloc[-1]

# Tokenize the input text and convert it to tensor format
inputs = tokenizer.encode(text, return_tensors='pt')

# Generate the summary using the model
outputs = model.generate(inputs, max_length=50)

# Decode the generated summary to a human-readable format
summarized_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

# Display the summarized text
summarized_text
```

We can observe the model's ability to effectively summarize the review. Although the maximum length was set to 50 tokens for demonstration purposes, the model was able to produce a concise and coherent summary.

## Conclusion

In this document, we demonstrated how to use the `transformers` library
to perform sentiment analysis, text translation, question answering, and
text summarization on car reviews using various pre-trained models. By
following the steps outlined here, we see the power of the Language
Models nowadays, which can make a lot of tasks easier, enabling some
different business to reach a great improvement, such as Customer
Experience.

The main goal here was to emphasize the usefulness of language models today and provide insights on how they can be leveraged to enhance various businesses. By harnessing the power of language models, businesses can achieve better results tailored to their specific needs.

