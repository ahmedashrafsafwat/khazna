create schema if not exists khazna collate utf8mb4_0900_ai_ci;

create table if not exists khazna.Products
(
	id varchar(50) not null,
	name varchar(50) null,
	brand varchar(50) null,
	category varchar(50) null,
	price double null,
	constraint product_id_uindex
		unique (id)
);

alter table khazna.Products
	add primary key (id);

create table if not exists khazna.Requests
(
	id varchar(50) not null,
	userid varchar(50) null,
	status varchar(50) null,
	price double null,
	productid varchar(50) null,
	constraint request_id_uindex
		unique (id)
);

alter table khazna.Requests
	add primary key (id);

create table if not exists khazna.Users
(
	id varchar(50) not null,
	name varchar(50) null,
	balance double null,
	email varchar(100) null,
	password varchar(100) null,
	max_balance double null,
	constraint user_email_uindex
		unique (email),
	constraint user_id_uindex
		unique (id)
);

alter table khazna.Users
	add primary key (id);


INSERT INTO khazna.Products (id, name, brand, category, price) VALUES ('03d1cfd0-d284-11eb-aacc-034f92788fcb', 'productname', 'brand', 'category', 10);
INSERT INTO khazna.Users (id, name, balance, email, password, max_balance) VALUES ('2ce5ad30-d223-11eb-8f37-a943a0fa29b7', 'Ahmed Ashraf', 30, 'ahmedashraf@gmail.com', '1234', 100);

