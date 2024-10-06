import pyperclip
import time
import json
import re  


with open('data.json', 'r') as file:
    question_answer_data = json.load(file)

# Function to clean up the text by removing excess spaces and newlines
def clean_text(text):
    # Replace multiple spaces and newlines with a single space
    return re.sub(r'\s+', ' ', text).strip()

# Function to get the answer for the given question
def get_answer(question):
    cleaned_question = clean_text(question)
    for qa in question_answer_data["data"]:
        if clean_text(qa['question']).lower() == cleaned_question.lower():
            return qa['answer']
    return "Answer not found!"

# Initialize last clipboard content and list to store answers
last_clipboard_data = ""
provided_answers = []

print("Monitoring clipboard for questions... Press Ctrl+C to stop.")

try:
    while True:
        # Step 2: Get the current clipboard data
        clipboard_data = pyperclip.paste()

        # Clean up clipboard data
        cleaned_clipboard_data = clean_text(clipboard_data)

        # Check if the clipboard data has changed and is not an answer
        if cleaned_clipboard_data and cleaned_clipboard_data != last_clipboard_data and cleaned_clipboard_data not in provided_answers:
            print(f"New question detected: {cleaned_clipboard_data}")

            # Step 3: Find the corresponding answer
            answer = get_answer(cleaned_clipboard_data)
            print(f"Answer: {answer}")
            
            # Copy answer back to clipboard
            pyperclip.copy(answer)

            # Add answer to the list of provided answers to avoid reprocessing
            provided_answers.append(answer)

            # Update the last clipboard data
            last_clipboard_data = cleaned_clipboard_data

        # Wait for 1 second before checking the clipboard again
        time.sleep(1)

except KeyboardInterrupt:
    print("\nStopped monitoring clipboard.")
