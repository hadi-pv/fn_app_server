CREATE TABLE public.news
(
    news_id text,
    image_link text NOT NULL,
    headline text NOT NULL,
    info text,
    author text,
    PRIMARY KEY(news_id)
);