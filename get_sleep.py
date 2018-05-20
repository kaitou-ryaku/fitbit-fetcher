import fitbit
import datetime
from ast import literal_eval
import os
import requests
from ast import literal_eval

CLIENT_ID     = '******'
CLIENT_SECRET = '********************************'
TOKEN_FILE    = 'token.txt'
CSV_PATH      = '***********'
# START_DATE    = datetime.date(****, **, **)
DAY_TERM      = 7 # one week

def get_sleep_analysis(get_day):
  sleep_list = []

  for delta in [-1,0,1]:
    day = get_day + datetime.timedelta(delta)
    day_str = day.strftime("%Y-%m-%d")

    json_filename = '{0}/{1}/{2}_{3}.json'.format(CSV_PATH, "sleep_json", day_str, "sleep_json")
    if not os.path.exists(json_filename):
      continue

    json_data = literal_eval(open(json_filename, 'r').read())

    for connected_sleep in json_data["sleep"]:
      for connected_30secs in connected_sleep["levels"]["data"]:

        current = datetime.datetime.strptime(connected_30secs["dateTime"], "%Y-%m-%dT%H:%M:%S.000")
        level   = connected_30secs["level"]
        seconds = connected_30secs["seconds"]

        for i in range(int(seconds/30)):
          sleep = (current, level)
          sleep_list.append(sleep)
          current += datetime.timedelta(seconds=30)

  sleep_list.sort

  f = open('{0}/{1}/{2}_{3}.csv'.format(CSV_PATH, "sleep_analysis", get_day.strftime("%Y-%m-%d"), "sleep_analysis"), 'w')
  for sleep in sleep_list:
    if sleep[0].date() == day:
      f.write(sleep[0].strftime("%H:%M:%S") + "," + sleep[1] + "\n")
  f.close()

def main():
  tokens = open(TOKEN_FILE).read()
  token_dict = literal_eval(tokens)
  access_token = token_dict["access_token"]
  refresh_token = token_dict["refresh_token"]

  def updateToken(token):
    f = open(TOKEN_FILE, "w")
    f.write(str(token))
    f.close()
    return

  client = fitbit.Fitbit(CLIENT_ID, CLIENT_SECRET, access_token = access_token, refresh_token = refresh_token, refresh_cb = updateToken)

  for day_back in range(0, DAY_TERM+1):
    get_day = datetime.date.today() - datetime.timedelta(day_back)
    get_day_str = get_day.strftime("%Y-%m-%d")

    tokens = open(TOKEN_FILE).read()
    headers = {
      "Authorization": "Bearer " + token_dict["access_token"]
    }

    url = "https://api.fitbit.com/1.2/user/-/sleep/date/" + get_day_str + "/" + get_day_str + ".json"

    response = requests.get(url, headers=headers)

    if "Too" in str(response.json()):
      break

    f = open('{0}/{1}/{2}_{3}.json'.format(CSV_PATH, "sleep_json", get_day_str, "sleep_json"), 'w')
    f.write(str(response.json()))
    f.close()

  for day_back in range(0, DAY_TERM):
    get_day = datetime.date.today() - datetime.timedelta(day_back)
    get_sleep_analysis(get_day)

if __name__ == "__main__":
  main()
