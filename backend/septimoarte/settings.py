"""
Django settings for septimoarte project.

Generated by 'django-admin startproject' using Django 1.8.4.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'jv&)bjcg=7a#41&3h%$z@b!()vmihxsknj)5@8!9=t5(3+j4p^'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'leaflet',
    'app',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

ROOT_URLCONF = 'septimoarte.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'septimoarte.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DB_NAME = os.environ.get('DB_NAME', 'dbname')
DB_USER = os.environ.get('DB_USER', 'user')
DB_PASS = os.environ.get('DB_PASS', 'pass')

DATABASES = {
    # 'default': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    # }
    'default':  {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': DB_NAME,
        'USER': DB_USER,
        'PASSWORD': DB_PASS,
        'HOST': 'localhost',
        'PORT': '5432'
    }
}


# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'

# django-leaflet settings
TOKEN = 'pk.eyJ1Ijoib2xjcmVhdGl2YSIsImEiOiJEZWUxUmpzIn0.buFJd1-sVkgR01epcQz4Iw'
TILE_ID = 'olcreativa.mle7fnoa'
T_URL = "https://{s}.tiles.mapbox.com/v4/%s/{z}/{x}/{y}.png?access_token=%s" % (TILE_ID, TOKEN)

LEAFLET_CONFIG = {
    # conf here
    # 'SPATIAL_EXTENT': (5.0, 44.0, 7.5, 46),
    # 'DEFAULT_CENTER': (6.0, 45.0),
    # 'DEFAULT_ZOOM': 16,
    # 'MIN_ZOOM': 3,
    # 'MAX_ZOOM': 18,
    # 'TILES': 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    'SPATIAL_EXTENT': (-58.531, -34.705, -58.335, -34.527),
    'DEFAULT_CENTER': (-58.447397, -34.603956),
    'DEFAULT_ZOOM': 12,
    'MIN_ZOOM': 12,
    'MAX_ZOOM': 19,
    'RESET_VIEW': False,
    'TILES': T_URL,
}
