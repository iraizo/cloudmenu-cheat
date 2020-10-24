# cloudmenu-cheat


- Create a database called menu.db in the sever directory 
```
CREATE TABLE "users" (
	"username"	TEXT NOT NULL,
	"auth"	TEXT NOT NULL,
	"features"	TEXT,
	"userid"	INTEGER,
	PRIMARY KEY("userid" AUTOINCREMENT)
)
```

- run `npm i`

- Run `npm run dev` to run a developement server locally
- Run `npm run build` to build a production build.
