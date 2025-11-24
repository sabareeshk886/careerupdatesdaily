import csv
import pandas as pd
from jobspy import scrape_jobs

# List of IT job roles in India
job_roles = [ "HR INTERN " , "HR MANAGER " , "HUMAN RESOURCE", "Fresher Business Analyst", "Fresher Data Engineer", "Fresher Data Scientist" , "Fresher Machine Learning Engineer",
    "Fresher BI Developer", "Fresher Manual QA Engineer", "Fresher Automation Tester", "Fresher Performance Tester", "Fresher QA ", "Fresher DevOps Engineer", "Fresher Cloud Engineer", "Fresher Site Reliability Engineer",
   "Fresher Security Analyst", "Fresher Penetration Tester", "Fresher Security Engineer",
    "Fresher IT Support", "Fresher System Administrator", "Fresher Network Engineer", "Fresher Cloud Support Specialist",
    "Fresher AI/ML Engineer", "Fresher NLP Engineer", "Fresher Blockchain Developer", "Fresher AR/VR Developer",
    "Fresher IoT Developer", "Fresher Robotics Engineer",
    "Fresher Product Manager", "Fresher Technical Project Manager", "Fresher Scrum Master",
    "Fresher UI/UX Designer", "Fresher Technical Writer", "Fresher Cloud/IT Consultant",
    "Fresher Software Engineer", "Fresher Full Stack Developer", "Fresher Frontend Developer", "Fresher Backend Developer",
    "Fresher Mobile App Developer", "Fresher Embedded Systems Developer", "Fresher Game Developer",
    "Fresher Data Analyst"
]

all_jobs = []

# Loop through each job role and scrape
for role in job_roles:
    print(f"Scraping jobs for: {role}")
    jobs = scrape_jobs(
        site_name=["indeed", "linkedin", "google", "glassdoor"],
        search_term=role,
        google_search_term=f"{role} jobs in India since yesterday",
        location="India",
        results_wanted=50,
        hours_old=72,
        country_indeed="India",
        linkedin_fetch_description=True
    )
    jobs['search_term'] = role
    all_jobs.append(jobs)

# Combine all results into a single DataFrame
combined_jobs = pd.concat(all_jobs, ignore_index=True)

print(f"Total jobs found: {len(combined_jobs)}")
print(combined_jobs.head())

# Save to CSV
combined_jobs.to_csv(
    "HRNOV.csv",
    quoting=csv.QUOTE_NONNUMERIC,
    escapechar="\\",
    index=False
)

# --- ADDED FOR WEBSITE INTEGRATION ---
import json
import os

print("Saving data for website...")

# Define output path (relative to this script)
output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public")
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

output_file = os.path.join(output_dir, "scraped_jobs.json")

# 1. Load existing jobs if file exists
existing_jobs = []
if os.path.exists(output_file):
    try:
        with open(output_file, 'r') as f:
            existing_jobs = json.load(f)
        print(f"Loaded {len(existing_jobs)} existing jobs.")
    except Exception as e:
        print(f"Error loading existing jobs: {e}")

# 2. Convert new scraped jobs to list of dicts
new_jobs_data = combined_jobs.to_dict(orient='records')

# 3. Combine existing and new jobs
# We use a dictionary keyed by job_url to deduplicate. 
# New jobs will overwrite old ones with the same URL (updating them).
job_map = {job.get('job_url'): job for job in existing_jobs if job.get('job_url')}

# Update/Add new jobs
for job in new_jobs_data:
    # Clean up data for JSON serialization
    if 'date_posted' in job and pd.notna(job['date_posted']):
        job['date_posted'] = str(job['date_posted'])
    else:
        job['date_posted'] = None
        
    # Handle NaN values
    for key, value in job.items():
        if pd.isna(value):
            job[key] = None
            
    if job.get('job_url'):
        job_map[job['job_url']] = job

# Convert back to list
final_jobs_list = list(job_map.values())

# 4. Sort by date_posted (newest first)
# We handle None values by treating them as very old dates
final_jobs_list.sort(key=lambda x: x.get('date_posted') or "", reverse=True)

print(f"Total unique jobs after merging: {len(final_jobs_list)}")

# 5. Save to JSON
with open(output_file, 'w') as f:
    json.dump(final_jobs_list, f, indent=2)

print(f"Jobs saved to {output_file} for website usage.")



