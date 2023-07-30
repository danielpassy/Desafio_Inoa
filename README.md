# Inoa Challenge

This repository contains the solution to the challenge proposed by INOA.

The challenge was announced as:
> A system that aids the investor in the decision making process of the buying/selling of Assets.
As such, the system should periodically record B3's stock prices and warn the investor when a certain stock reaches a certain price by Email

### Requirements:

1. It should have a web interface that allowed users to:
    - Decide which stocks he wants to monitor;
    - Decide the price at which he wants to be notified;
    - Decide the frequency of price comparising;
2. The system should use a public source of data 
3. The user should be able to see the stock price history;
4. It should email ths user suggesting him to sell if below the minimum price or buy if above the maximum price;
5. It should be built using Django and Python;
### Running the Project

To run the project, you need to have Docker, Docker Compose, python and poetry installed.

Then, run the following command:
```bash
cd backend
```
Install the dependencies
```bash
poetry install
```
start the containers
```bash
docker compose up
```
run the migrations and start the development server
```bash
./manage.py migrate
./python manage.py runserver
```


## Technology overview

The project is built using:

- Python/Django on the Backend with type anottations
- React as a SPA on the Frontend
- PostgreSQL as the database
- RabbitMQ+Celery as asyncronous task features
- CeleryBeat as a periodic task scheduler
- Docker as containerization tool

#### Discussion on the technology choices

- Django as REST API backend
- Django Ninja, which provides:
    - input validation with Pydantic + type annotations
    - OpenAPI documentation
    - Other REST functionalities
- TDD, with mostly integrations tests.
- Adapters that are easily replaceable, to allow for easy change of data sources and service providers
- Celery + RabbitMQ to allow for asyncronous tasks
- Docker to allow for easy deployment and development
- Docker compose to allow for better development experience
- Poetry for dependency management and create deterministic builds


<b>Q</b>: Why Django Ninja?<br>
<b>A</b>: It a modern way to build APIs with Django, inspired by FastAPI philosophy. 

<b>Q</b>: Why not unit tests?<br>
<b>A</b>: I tend to always write one integration test for the intenteded use and then unit test for the other cases. Due to time constraints, I decided to focus on the integration tests.

<b>Q</b>: Why RabbitMQ + celery, why not just supervisorMD and cronTask? <br>
<b>A</b>: I wanted to show best practices on how to architect this kind of application.

<b>Q</b>: Why React as SPA, why not NEXTJS or templates<br>
<b>A</b>: React is the technology that the company uses. And the extra features of NEXTJS would need more time.

<b>Q</b>: Why PostgreSQL?<br>
<b>A</b>: It's definitely not the best fit for time series data. I'd use InfluxDB, Cassandra or other Time series db. But It would require much more studying as I'm not familiar with those DBs. With more time, it would be one of the top priorities.