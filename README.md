# port-to-domain

hostsファイルとnginxのserversディレクトリに設定ファイルを作っていくスクリプトです。

以下の環境が必要です。

- nginx
- nodeJS

## 目的

`localhost:3000` を `myapp` でアクセスしたい。

settins.jsonを以下のように設定し、コマンドを実行します。

```
{
  "nginx_servers_dir": "/usr/local/etc/nginx/servers/",
  "hosts": "/etc/hosts",
  "nginx_server_settings": {
    "listen": 80,
    "location": {
      "proxy_pass": "$protocol://$address:$port/$dir",
      "index": "index.html index.htm"
    }
  },
  "servers": {
    "myapp": {
      "port": 3000
    },
  }
}
```
hostsとnginxの設定に反映する。  
`sudo node port-to-domain.js`

nginxを再起動。

## settings.jsonの設定方法

- `nginx_servers_dir` nginx.confがserverの設定をincludeするディレクトリ
- `hosts` hostsファイルの場所
- `nginx_server_settings` serversに配置する設定方法。 locationに書き加えたりすることができます。
- `nginx_restart_command` nginxを再起動するコマンド
- `servers` 任意のドメイン名をキーに設定します

```

"domain名": {
  "port": ポート番号,
  "dir": デフォルトの階層,
  "address": もしリダイレクト先が127.0.0.1以外の場合に設定する,
  "protocol": もしhttp以外のプロトコルを使用したい場合に設定する
}

```

## 注意

hostsファイルをバックアップを取ってから実行することをおすすめします。