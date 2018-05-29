import csv
import datetime
import os

CSV_PATH = "../csv_data"
SLEEP_TYPE = ["wake", "rem", "light", "deep", "awake", "restless", "asleep"]
START_DATE  = datetime.date(2017, 11, 13)

def get_total_steps(day):
  steps_sum = 0

  dir_name = "steps"
  file_name = "{0}/{1}/{2}_{3}.csv".format(CSV_PATH, dir_name, day, dir_name)
  if not os.path.exists(file_name):
    return steps_sum

  csv_file = open(file_name, "r", encoding="utf_8")
  f = csv.reader(csv_file, delimiter=",")

  for row in f:
    steps_sum += int(row[1])

  csv_file.close()
  return steps_sum

def get_total_sleep_analysis(day):
  sleep_sum = {}
  for key in SLEEP_TYPE:
    sleep_sum[key] = 0

  dir_name = "sleep_analysis"
  file_name = "{0}/{1}/{2}_{3}.csv".format(CSV_PATH, dir_name, day, dir_name)
  if not os.path.exists(file_name):
    return sleep_sum

  csv_file = open(file_name, "r", encoding="utf_8")
  f = csv.reader(csv_file, delimiter=",")

  for row in f:
    sleep_sum[row[1]] += 30

  csv_file.close()
  return sleep_sum

def main():
  f = open(CSV_PATH + "/summary.csv", "w", encoding="utf_8")

  f.write("YYYY-MM-DD,steps")
  for key in SLEEP_TYPE:
    f.write("," + key)
  f.write("\n")

  current_date = START_DATE
  while current_date < datetime.date.today():
    current_date += datetime.timedelta(1)
    get_day_str = current_date.strftime("%Y-%m-%d")

    result_str = ""
    result_str += get_day_str
    result_str += "," + str(get_total_steps(get_day_str))
    sleep_sum   = get_total_sleep_analysis(get_day_str)
    for key in SLEEP_TYPE:
      result_str += "," + str(sleep_sum[key])
    result_str += "\n"

    f.write(result_str)

if __name__ == "__main__":
  main()
