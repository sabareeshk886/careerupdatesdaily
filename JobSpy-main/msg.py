import pandas as pd
import os
import re
import random

# -----------------------
# Settings
# -----------------------
# WhatsApp group link
group_link = "https://chat.whatsapp.com/Bq7fQxxc1ySAPpJcSiuE3H"

# Current folder (where script runs)
current_folder = os.path.dirname(os.path.abspath(__file__))

# CSV file path
csv_file = os.path.join(current_folder, "neeeefresherfulljobs.csv")
output_file = os.path.join(current_folder, "neeeefresherfulljobs.txt")

# -----------------------
# Functions
# -----------------------
def extract_experience(description):
    """Extract experience info from job description using regex."""
    if not description or description.lower() == 'nan':
        return "Not Specified"

    patterns = [
        r'(\d+\+?\s?(?:years?|yrs?))',
        r'(\d+\s?-\s?\d+\s?(?:years?|yrs?))',
        r'(minimum\s\d+\s?(?:years?|yrs?))',
        r'(at least\s\d+\s?(?:years?|yrs?))'
    ]

    for pattern in patterns:
        match = re.search(pattern, description, re.IGNORECASE)
        if match:
            return match.group(0)
    return "Not Specified"


def generate_whatsapp_message(row):
    """Generate WhatsApp formatted message for a job row."""

    # Safe access with default
    title = row.get('title', 'Not Specified')
    company = row.get('company', 'Not Specified')
    location = row.get('location', 'Not Specified').strip() or "Not Specified"
    description = row.get('description', '')
    date_posted = row.get('date_posted', 'Not Specified')

    # Salary formatting
    min_amt = str(row.get("min_amount", "")).split(".")[0] if row.get("min_amount") else ""
    max_amt = str(row.get("max_amount", "")).split(".")[0] if row.get("max_amount") else ""
    currency = row.get("currency", "")
    salary_source = row.get("salary_source", "")

    if min_amt and max_amt:
        salary = f"{currency} {min_amt} - {max_amt}"
    elif min_amt:
        salary = f"{currency} {min_amt}+"
    elif max_amt:
        salary = f"{currency} Up to {max_amt}"
    elif salary_source.strip():
        salary = salary_source
    else:
        salary = "Not Specified"

    # Experience
    experience = extract_experience(description)

    # Apply link
    apply_link = row.get("job_url_direct", "").strip() or row.get("job_url", "").strip() or "Not Provided"

    # WhatsApp message
    msg = f"""🔗 Group Link: {group_link}
🚀 Job Alert!

👨‍💻 Role: {title}
🏢 Company: {company}
📍 Location: {location}
💰 Salary: {salary}
🕒 Experience: {experience}
🗓 Posted: {date_posted}

📩 Apply Here: {apply_link}
"""
    return msg


# -----------------------
# Main Script
# -----------------------
if not os.path.exists(csv_file):
    print(f"❌ CSV file not found at {csv_file}. Please place 'haifulljobs.csv' in the script folder.")
    exit()

try:
    df = pd.read_csv(csv_file)

    # Ensure all expected columns exist
    expected_columns = ["title", "company", "location", "description", "date_posted",
                        "job_url_direct", "job_url", "min_amount", "max_amount", "currency", "salary_source"]
    for col in expected_columns:
        if col not in df.columns:
            df[col] = ""

    # Convert columns to string
    for col in expected_columns:
        df[col] = df[col].astype(str).replace("nan", "")

    # ✅ Shuffle the DataFrame so different jobs mix together
    df = df.sample(frac=1, random_state=None).reset_index(drop=True)

    # Process all rows
    with open(output_file, "w", encoding="utf-8") as f_out:
        for _, row in df.iterrows():
            msg = generate_whatsapp_message(row)
            f_out.write(msg + "\n\n" + "—" * 50 + "\n\n")

    print(f"\n📄 WhatsApp messages saved in '{output_file}' (Jobs shuffled randomly ✅)")
except Exception as e:
    print(f"❌ Error processing CSV: {e}")
