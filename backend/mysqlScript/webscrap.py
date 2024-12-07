from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin
import random
from joblib import Parallel, delayed

def get_data(a):
    for i in range(a, a+1):

        url = f'https://books.toscrape.com/catalogue/page-{i}.html'

        catalogue_text = requests.get(url)
        catalogue_text.encoding = 'utf-8'
        catalogue_text = catalogue_text.text
        soup = BeautifulSoup(catalogue_text, 'lxml')

        books = soup.find_all('li', class_='col-xs-6 col-sm-4 col-md-3 col-lg-3')

        for book in books: 
            book_url = urljoin(url, book.a['href'])
            html_text = requests.get(book_url)
            html_text.encoding = 'utf-8'
            html_text = html_text.text

            soup = BeautifulSoup(html_text, 'lxml')
            book = soup.find('article', class_='product_page')
            title = book.h1.text
            price = float(book.p.text[1:])
            image_url = urljoin(book_url, book.img['src'])

            with open('data.txt', 'a') as file:
                file.write(f'(\'{title}\', {random.randint(1, 4)}, {random.randint(1, 4)}, {price}, \'{image_url}\'),\n')

Parallel(n_jobs=4)(delayed(get_data)(i) for i in range(1, 51))
