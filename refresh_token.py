import requests
import time
import json

LOGIN_URL = 'https://api.quxuanshu.com/pass/login'
TOKEN_URL = 'https://api.quxuanshu.com/pass/accountLogin'

data = {
    "account": "<趣选书账号>",
    "password": "<趣选书密码>",
    "loginMethod": 0,
    "isAutoLogin": "0",
    "multiUserType": "1"
}


def send_request(url, data):
    retries = 0
    max_retries = 5
    retry_delay = 2
    while retries < max_retries:
        try:
            response = requests.post(url, json=data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            retries += 1
            print(f'请求失败，重试次数: {retries}/{max_retries}')
            print(f'错误信息: {e}')
            if retries < max_retries:
                time.sleep(retry_delay)
            else:
                print('已达到最大重试次数，放弃重试')
    return None


def update_token(token, file_path="secret.json"):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            secret = json.load(f)
            print(secret)
        secret['accessTokenQu'] = token
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(secret, f, indent=4, ensure_ascii=False)
    except Exception as e:
        print(f'请检查文件路径')


if __name__ == "__main__":
    login_response = send_request(LOGIN_URL, data)
    login_info = login_response.get('data', {})
    login_account_list = login_info.get('loginAccountList', [])
    if not login_account_list:
        print('请填充账号密码')
        exit(1)
    del login_account_list[0]
    login_info['loginAccountList'] = login_account_list
    token_response = send_request(TOKEN_URL, login_info)
    token = token_response.get('data', {}).get('accessToken', '')
    if not token:
        print('没有token')
    else:
        update_token(token)

