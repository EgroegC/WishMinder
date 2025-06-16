
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

CREATE TABLE public.contacts (
    id integer NOT NULL,
    user_id integer,
    name character varying(100),
    surname character varying(100),
    phone text NOT NULL,
    email text,
    birthdate date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    phone_hash character(64),
    email_hash character(64),
    CONSTRAINT name_or_surname_required CHECK (((name IS NOT NULL) OR (surname IS NOT NULL)))
);



CREATE SEQUENCE public.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


CREATE TABLE public.messages (
    id integer NOT NULL,
    type character varying(10) NOT NULL,
    text text NOT NULL,
    CONSTRAINT messages_type_check CHECK (((type)::text = ANY ((ARRAY['birthday'::character varying, 'nameday'::character varying])::text[])))
);


CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


CREATE TABLE public.namedays (
    id integer NOT NULL,
    name_id integer NOT NULL,
    nameday_date date NOT NULL
);


CREATE SEQUENCE public.namedays_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.namedays_id_seq OWNED BY public.namedays.id;

CREATE TABLE public.names (
    id integer NOT NULL,
    name text NOT NULL
);


CREATE SEQUENCE public.names_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.names_id_seq OWNED BY public.names.id;

CREATE TABLE public.push_subscriptions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    endpoint text NOT NULL,
    expiration_time bigint,
    keys jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_agent text
);


CREATE SEQUENCE public.push_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.push_subscriptions_id_seq OWNED BY public.push_subscriptions.id;


CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(1024) NOT NULL,
    CONSTRAINT users_email_check CHECK ((length((email)::text) >= 13)),
    CONSTRAINT users_name_check CHECK ((length((name)::text) >= 3)),
    CONSTRAINT users_password_check CHECK ((length((password)::text) >= 5))
);


CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;



ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


ALTER TABLE ONLY public.namedays ALTER COLUMN id SET DEFAULT nextval('public.namedays_id_seq'::regclass);


ALTER TABLE ONLY public.names ALTER COLUMN id SET DEFAULT nextval('public.names_id_seq'::regclass);


ALTER TABLE ONLY public.push_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.push_subscriptions_id_seq'::regclass);


ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);



ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.namedays
    ADD CONSTRAINT namedays_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.names
    ADD CONSTRAINT names_name_key UNIQUE (name);



ALTER TABLE ONLY public.names
    ADD CONSTRAINT names_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.names
    ADD CONSTRAINT unique_name UNIQUE (name);



ALTER TABLE ONLY public.namedays
    ADD CONSTRAINT unique_nameday UNIQUE (name_id, nameday_date);


ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT unique_user_endpoint UNIQUE (user_id, endpoint);



ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT unique_user_phone_hash UNIQUE (user_id, phone_hash);



ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);



ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;



ALTER TABLE ONLY public.namedays
    ADD CONSTRAINT namedays_name_id_fkey FOREIGN KEY (name_id) REFERENCES public.names(id) ON DELETE CASCADE;


ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;



