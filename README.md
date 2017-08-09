Background
==================================
KMB has a website and mobile application to track bus arrival time. We can improve it by digest such data and visualize it on a map, such that we can see the overall traffic status.
Note that we shall not be bounded to KMB, the system should accept other data source as well, and we are not limited to show bus.

Goal
==================================
The goal of this project is to make a portal / platform which fetch data from KMB and process it such that we can estimate buses location and display on Google Map. The bus location should be update and it looks like real time traffic monitor.
As there are about 3920 buses on KMB, we usually don’t display all buses at once (but it looks so fun), we shall provide a filter mechanic on the platform.

Servers
==================================
The platform consist of the follow servers, which can be installed on standalone machine or just colocated.
1. MySQL
2. Data Grabber and Processor
3. Portal

Setup (MySQL)
==================================
1. Install MySQL Server
```
> sudo apt-get install mysql-server
```
2. Login mysql
```
mysql -u root -p
```
3. Create database user
```
CREATE USER 'bususer'@'localhost' IDENTIFIED BY '1234';
CREATE USER 'bususer'@'%' IDENTIFIED BY '1234';
CREATE DATABASE busdb;
GRANT ALL ON busdb.* TO 'bususer'@'localhost'
GRANT ALL ON busdb.* TO 'bususer'@'%'
```
4. Create Tables
```
Reference to database/create_table.txt
```
5. Install store-procedures
```
Reference to database/sp_*.txt
```

Setup (Data Grabber)
==================================
1. Install Node.JS 8
```
https://nodejs.org/en/download/package-manager/
```
2. Install npm packages
```
> cd src
> npm install
```

Run Data Grabber
==================================
0. Adjust config.json if needed
1. Update bus stop information
```
> cd src
> nodejs kmb_updateroute.js 12A
```
2. Update arrival estimation
```
> cd src
> nodejs kmb_updateeta.js 12A 1
```
PS. You might want to setup cron job for this

Setup (Portal Server)
==================================
1. Install Node.JS 8
```
https://nodejs.org/en/download/package-manager/
```
2. Install npm packages
```
> cd src
> npm install
```

Run Portal
==================================
NOTE: Adjust config.json if needed
```
> cd src
> nodejs portal.js
```
NOTE: As PoC the route is hardcoded on index.html
