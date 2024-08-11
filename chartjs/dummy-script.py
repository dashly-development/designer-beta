import json
import os
from datetime import datetime
import random

# Directory to save the JSON files
output_dir = "./dummy/data/dummy/simple_simon/dashboard_1"
os.makedirs(output_dir, exist_ok=True)

# Metadata template
metadata = {
    "creation_date": datetime.now().isoformat(),
    "data_source": "Simulated Data",
    "time_period": "Monthly",
    "version": "1.0",
    "author": "Data Simulation Tool",
    "data_quality": "High"
}

# Generate data for 12 months
months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

# Data template for each KPI
data_templates = {
    "cancellations_reschedulings.json": {
        "metadata": {**metadata, "data_type": "Cancellations and Reschedulings", "description": "Simulated data for cancellations and reschedulings.", "tags": ["cancellations", "rescheduling", "monthly"]},
        "data": {
            "months": months,
            "metrics": [
                {
                    "name": "Cancellations",
                    "values": [random.randint(0, 5) for _ in months]
                },
                {
                    "name": "Reschedulings",
                    "values": [random.randint(1, 3) for _ in months]
                }
            ]
        }
    },
    "capacity_utilization.json": {
        "metadata": {**metadata, "data_type": "Capacity Utilization", "description": "Simulated capacity utilization data.", "tags": ["capacity", "utilization", "monthly"], "units": "Percentage"},
        "data": {
            "months": months,
            "metrics": [
                {
                    "name": "Utilization",
                    "values": [random.randint(60, 90) for _ in months]
                }
            ]
        }
    },
    "job_completion_time.json": {
        "metadata": {**metadata, "data_type": "Job Completion Time", "description": "Simulated job completion times.", "tags": ["jobs", "completion", "time", "monthly"], "units": "Days"},
        "data": {
            "months": months,
            "metrics": [
                {
                    "name": "Completion Time (Days)",
                    "values": [round(random.uniform(4, 8), 1) for _ in months]
                }
            ]
        }
    },
    "overtime.json": {
        "metadata": {**metadata, "data_type": "Overtime", "description": "Simulated overtime data.", "tags": ["overtime", "hours", "monthly"], "units": "Hours"},
        "data": {
            "months": months,
            "metrics": [
                {
                    "name": "Overtime Hours",
                    "values": [random.randint(10, 40) for _ in months]
                }
            ]
        }
    },
    "resource_usage.json": {
        "metadata": {**metadata, "data_type": "Resource Usage", "description": "Simulated resource usage data.", "tags": ["resource", "usage", "monthly"], "units": "Percentage"},
        "data": {
            "months": months,
            "metrics": [
                {
                    "name": "Machinery Usage",
                    "values": [random.randint(40, 60) for _ in months]
                },
                {
                    "name": "Vehicles Usage",
                    "values": [random.randint(30, 50) for _ in months]
                },
                {
                    "name": "Tools Usage",
                    "values": [random.randint(20, 40) for _ in months]
                }
            ]
        }
    },
    "route_optimization.json": {
        "metadata": {**metadata, "data_type": "Route Optimization", "description": "Simulated route optimization data.", "tags": ["route", "optimization", "monthly"], "units": "Kilometers/Jobs"},
        "data": {
            "months": months,
            "metrics": [
                {
                    "name": "Average Distance (km)",
                    "values": [random.randint(80, 150) for _ in months]
                },
                {
                    "name": "Jobs Count",
                    "values": [random.randint(20, 60) for _ in months]
                }
            ]
        }
    },
    "schedule_adherence.json": {
        "metadata": {**metadata, "data_type": "Schedule Adherence", "description": "Simulated schedule adherence data.", "tags": ["schedule", "adherence", "monthly"], "units": "Percentage"},
        "data": {
            "months": months,
            "metrics": [
                {
                    "name": "Adherence",
                    "values": [random.randint(85, 100) for _ in months]
                }
            ]
        }
    }
}

# Save each JSON file
for filename, content in data_templates.items():
    with open(os.path.join(output_dir, filename), 'w') as f:
        json.dump(content, f, indent=4)

print(f"Data files saved to: {output_dir}")