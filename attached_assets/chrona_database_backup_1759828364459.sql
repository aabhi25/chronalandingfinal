--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (63f4182)
-- Dumped by pg_dump version 16.9

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

--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.blog_posts (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    featured_image text,
    published boolean DEFAULT false NOT NULL,
    published_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    meta_description text,
    reading_time text,
    author text DEFAULT 'Admin'::text NOT NULL
);


ALTER TABLE public.blog_posts OWNER TO neondb_owner;

--
-- Name: contact_submissions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.contact_submissions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    company text,
    phone text,
    message text NOT NULL,
    submitted_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.contact_submissions OWNER TO neondb_owner;

--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.blog_posts (id, title, slug, excerpt, content, featured_image, published, published_at, created_at, updated_at, tags, meta_description, reading_time, author) FROM stdin;
7d7123a0-45d3-4755-ba0d-46f91eb6174e	How AI is Changing the Future of School ERPs	how-ai-is-changing-the-future-of-school-erps	AI is transforming how schools operate. From automating attendance to predicting student performance, School ERPs are becoming smarter and more efficient. This blog explores how AI is reshaping school management, empowering teachers, administrators, and parents with better tools for decision-making and creating future-ready learning environments.	<strong>Education Meets Artificial Intelligence</strong>\nThe education sector has always been about <strong>people</strong>–teachers, students, and parents. But with increasing administrative demands, technology now plays a vital role in reducing workload and improving efficiency. The next big leap is here: <strong>AI-powered School ERPs</strong>. Platforms like <strong>Chrona</strong> are revolutionizing how schools function.\n\n<strong>1. Automating Daily Administrative Work</strong>\nTasks like attendance, fee reminders, and timetable scheduling take hours when done manually. With AI, these processes are <strong>automated</strong>, <strong>freeing teachers</strong> to focus on teaching rather than paperwork.\n\n<strong>2. Predictive Insights for Student Success</strong>\nAI doesn’t just track attendance and grades. It can analyze performance patterns, predict students who may need extra support, and help schools intervene early. This leads to <strong>better academic outcomes</strong> and improved <strong>student well-being</strong>.\n\n<strong>3. Smarter Parent-Teacher Communication</strong>\nAI-driven solutions ensure parents stay informed <strong>24/7</strong>. Instant updates on attendance, exam schedules, automated fee reminders, and personalized communication make interactions <strong>transparent, efficient, and reliable</strong>.\n\n<strong>4. Personalized Learning Support</strong>\nBy analyzing each student’s performance, AI recommends tailored study plans and custom learning resources, helping <strong>bridge learning gaps</strong> and giving every student a chance to succeed.\n\n<strong>5. Data-Driven Decision Making for Schools</strong>\nSchool leaders can generate <strong>AI-powered MIS reports</strong> to track attendance trends, academic performance, and financial health. Decisions become <strong>informed, accurate, and actionable</strong>, replacing guesswork with data-backed insights.\n\n<strong>6. Enhancing Security & Compliance</strong>\nAI helps schools safeguard <strong>sensitive student data</strong> by detecting anomalies and ensuring compliance with privacy standards, building <strong>trust with parents</strong> and maintaining <strong>data integrity</strong>.\n\n<strong>The Future is AI-Powered</strong>\nAI is no longer just a buzzword–it’s a <strong>necessity</strong> for schools that want to stay ahead. By adopting an AI-powered ERP like <strong>Chrona</strong>, schools can reduce inefficiencies, support teachers, empower parents, and build smarter learning environments.\n\n👉 <strong>Ready to see AI in action at your school? <a href="#">Book a demo of Chrona today!</a></strong>\n	/upload_assets/1758712121978-801812165.jpg	t	2025-09-24 10:32:31.671	2025-09-24 10:32:33.369088	2025-09-24 11:08:46.162	{"School ERP","Education Technology","AI in Schools",EdTech,"Digital Transformation","School Management",Chrona}	\N	\N	Admin
\.


--
-- Data for Name: contact_submissions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.contact_submissions (id, name, email, company, phone, message, submitted_at) FROM stdin;
bf66a778-3175-460d-8ca0-53c387d36794	Abhi	abhi@gmail.com	ABC	9810560800	Hello I have a need of this erp bla bla	2025-09-24 09:46:53.767498
\.


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_slug_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_slug_unique UNIQUE (slug);


--
-- Name: contact_submissions contact_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

