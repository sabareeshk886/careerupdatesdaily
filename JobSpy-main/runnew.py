import csv
import os
from jobspy import scrape_jobs
import pandas as pd

# ==========================
# CONFIGURATION
# ==========================
output_file = "ITdubai.csv"
country = "united arab emirates"
location = "Dubai"
results_wanted = 100
hours_old = 720  # Last 30 days
sites = ["indeed", "linkedin", "google"]

# Broader search queries for better match
search_queries = [
    "IT jobs in Dubai",
    "Fresher IT jobs in Dubai"
]

# ==========================
# SCRAPING STARTS
# ==========================
all_jobs = pd.DataFrame()

for search_term in search_queries:
    print(f"Scraping jobs for query: {search_term} ...")
    try:
        jobs = scrape_jobs(
            site_name=sites,
            search_term=search_term,
            location=location,
            results_wanted=results_wanted,
            hours_old=hours_old,
            country_indeed=country,
            linkedin_fetch_description=False
        )

        if jobs.empty:
            print(f"No jobs found for query: {search_term}")
            continue

        expected_columns = [
            "title",
            "company",
            "location",
            "posted_date",
            "description",
            "site_name",
            "link"
        ]
        for col in expected_columns:
            if col not in jobs.columns:
                jobs[col] = ""

        print(f"Found {len(jobs)} jobs for query: {search_term}")
        all_jobs = pd.concat([all_jobs, jobs], ignore_index=True)

    except Exception as e:
        print(f"Error scraping '{search_term}': {e}")

# ==========================
# CLEANUP & SAVE TO CSV
# ==========================
if not all_jobs.empty:
    all_jobs.drop_duplicates(subset=["title", "company", "location"], inplace=True)

    if os.path.exists(output_file):
        os.remove(output_file)

    all_jobs.to_csv(
        output_file,
        quoting=csv.QUOTE_NONNUMERIC,
        escapechar="\\",
        index=False
    )

    print(f"\n✅ CSV saved successfully to {os.path.abspath(output_file)} with {len(all_jobs)} jobs.")
else:
    print("\n❌ No jobs found for any search query. CSV not created.")
