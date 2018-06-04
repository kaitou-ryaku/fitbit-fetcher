import csv
import datetime
import os
from ast import literal_eval

CSV_PATH = "../csv_data"
SLEEP_TYPE = ["wake", "rem", "light", "deep", "awake", "restless", "asleep"]
START_DATE  = datetime.date(2017, 11, 13)

def get_total_steps(day):
  dir_name = "steps"
  csvname = "{0}/{1}/{2}_{3}.csv".format(CSV_PATH, dir_name, day, dir_name)
  if not os.path.exists(csvname):
    return ",0"

  csv_data = open(csvname, "r", encoding="utf_8")
  f = csv.reader(csv_data, delimiter=",")

  steps_sum = 0
  for row in f:
    steps_sum += int(row[1])

  csv_data.close()
  return "," + str(steps_sum)

def get_total_sleep(day):
  sleep_sum = {}
  for key in SLEEP_TYPE:
    sleep_sum[key] = 0

  dir_name = "sleep"
  csvname = "{0}/{1}/{2}_{3}.csv".format(CSV_PATH, dir_name, day, dir_name)
  if not os.path.exists(csvname):
    return ",0,0,0,0,0,0,0"

  csv_data = open(csvname, "r", encoding="utf_8")
  f = csv.reader(csv_data, delimiter=",")

  for row in f:
    sleep_sum[row[1]] += 30

  csv_data.close()

  ret = ""
  for key in SLEEP_TYPE:
    ret += "," + str(sleep_sum[key])

  return ret

def get_total_heart(day):
  dir_name = "heart"
  ret = ""

  csvname  = "{0}/{1}/{2}_{3}.csv".format(CSV_PATH, dir_name, day, dir_name)
  if not os.path.exists(csvname):
    return ",0,0,0,0,0,0,0,0,0,0"
  line_num = sum(1 for line in open(csvname))
  ret += "," + str(line_num)

  jsonname  = "{0}/{1}/{2}_{3}.json".format(CSV_PATH, dir_name, day, dir_name)
  if not os.path.exists(jsonname):
    return ret + ",0,0,0,0,0,0,0,0,0"

  json_data = literal_eval(open(jsonname, "r").read())
  value = json_data["activities-heart"][0]["value"]
  ret += "," + str(value["restingHeartRate"])

  for term in value["heartRateZones"]:
    if term["name"] == "Out of Range":
      ret += "," + str(term["caloriesOut"]) + "," + str(term["minutes"])
      break

  for term in value["heartRateZones"]:
    if term["name"] == "Fat Burn":
      ret += "," + str(term["caloriesOut"]) + "," + str(term["minutes"])
      break

  for term in value["heartRateZones"]:
    if term["name"] == "Cardio":
      ret += "," + str(term["caloriesOut"]) + "," + str(term["minutes"])
      break

  for term in value["heartRateZones"]:
    if term["name"] == "Peak":
      ret += "," + str(term["caloriesOut"]) + "," + str(term["minutes"])
      break

  return ret

def get_total_lack_second(day):
  dir_name = "lack"
  csvname = "{0}/{1}/{2}_{3}.csv".format(CSV_PATH, dir_name, day, dir_name)
  if not os.path.exists(csvname):
    return str(24*3600)

  csv_data = open(csvname, "r", encoding="utf_8")
  f = csv.reader(csv_data, delimiter=",")

  lack_sum = 0
  for row in f:
    lack_sum += int(row[2])

  csv_data.close()

  return "," + str(lack_sum)

def main():
  f = open(CSV_PATH + "/summary.csv", "w", encoding="utf_8")

  f.write("YYYY-MM-DD,lackSecond,steps")
  for key in SLEEP_TYPE:
    f.write("," + key)
  f.write("heartLineNum,restingHeartRate,calory_1,minutes_1,calory_2,minutes_2,calory_3,minutes_3,calory_4,minutes_4")
  f.write("\n")

  current_date = START_DATE
  while current_date < datetime.date.today():
    current_date += datetime.timedelta(1)
    get_day_str = current_date.strftime("%Y-%m-%d")

    result_str  = get_day_str
    result_str += get_total_lack_second(get_day_str)
    result_str += get_total_steps(get_day_str)
    result_str += get_total_sleep(get_day_str)
    result_str += get_total_heart(get_day_str)
    result_str += "\n"

    f.write(result_str)

if __name__ == "__main__":
  main()
