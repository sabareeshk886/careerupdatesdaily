import pandas as pd
import os
import re
from itertools import zip_longest

# WhatsApp group link
group_link = "https://chat.whatsapp.com/Bq7fQxxc1ySAPpJcSiuE3H"

# Folder where CSV files are stored
csv_folder = r"C:\Users\sabar\Downloads\JobSpy-main\JobSpy-main"

# CSV file name (only one to process)
csv_file = os.path.join(csv_folder, "sales.csv")

# Output file
output_file = "sales.txt"

# Keep file as list (so rest of code works without changes)
csv_files = [csv_file]
print("Selected CSV file:", csv_files)

def extract_experience(description):
    """Extract experience info from job description using regex."""
    if not description:
        return "Not Specified"

    patterns = [
        r'(\d+\+?\s?years?)',
        r'(\d+\s?-\s?\d+\s?years?)',
        r'(minimum\s\d+\s?years?)',
        r'(at least\s\d+\s?years?)'
    ]

    for pattern in patterns:
        match = re.search(pattern, description, re.IGNORECASE)
        if match:
            return match.group(0)
    return "Not Specified"

def generate_whatsapp_message(row):
    """Generate WhatsApp formatted message for a job row."""

    # Salary formatting
    min_amt = str(row.get("min_amount", "")).split(".")[0] if row.get("min_amount") else ""
    max_amt = str(row.get("max_amount", "")).split(".")[0] if row.get("max_amount") else ""
    currency = row.get("currency", "")
    salary = ""
    if min_amt and max_amt:
        salary = f"{currency} {min_amt} - {max_amt}"
    elif min_amt:
        salary = f"{currency} {min_amt}+"
    elif max_amt:
        salary = f"{currency} Up to {max_amt}"
    else:
        salary = row.get("salary_source", "")

    # Location
    location = row.get("location", "")
    if not location.strip():
        location = "Not Specified"

    # Experience extracted from description
    experience = extract_experience(row.get("description", ""))

    # Apply link
    apply_link = row.get("job_url_direct", "")
    if not apply_link.strip():
        apply_link = row.get("job_url", "")

    msg = f"""🔗 Group Link: {group_link}
🚀 Job Alert!

👨‍💻 Role: {row.get('title', '')}
🏢 Company: {row.get('company', '')}
📍 Location: {location}
💰 Salary: {salary}
🕒 Experience: {experience}
🗓 Posted: {row.get('date_posted', '')}

📩 Apply Here: {apply_link}
"""
    return msg

# Step 1: Read the single CSV into rows
all_rows = []
for file_name in csv_files:
    try:
        df = pd.read_csv(file_name)
        # Convert relevant columns to string
        cols_to_str = ["title", "company", "location", "description",
                       "date_posted", "job_url_direct", "job_url",
                       "min_amount", "max_amount", "currency", "salary_source"]
        for col in cols_to_str:
            if col in df.columns:
                df[col] = df[col].astype(str).replace("nan", "")

        # Store rows as dictionaries
        rows = [row for _, row in df.iterrows() if row.get("title") and row.get("company")]
        all_rows.append(rows)

        print(f"✅ Loaded file: {file_name} ({len(rows)} jobs)")
    except Exception as e:
        print(f"❌ Skipped file {file_name}: {e}")

# Step 2: Since we only have one file, no need for round-robin shuffle
with open(output_file, "w", encoding="utf-8") as f_out:
    for row in all_rows[0]:
        msg = generate_whatsapp_message(row)
        f_out.write(msg + "\n\n" + "—" * 50 + "\n\n")

print(f"\n📄 WhatsApp messages saved in '{output_file}'")
