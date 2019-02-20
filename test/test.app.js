const app = require('../app');
const expect = require('chai').expect;
const callMyApp = require('supertest');
const books = require('../books')

describe('NY times book search', () => {
  it('should throw error if sort is not rank or title', () => {
    const sort = 'genre';

    return callMyApp(app)
      .get('/books')
      .query({ sort })
      .expect(400, 'Sort must be one of title or rank')
  });

  it('Should filter books by search query', () => {

    const query = {search: 'SNUFF'}

    return callMyApp(app)
      .get('/books')
      .query(query)
      .expect(200, [{
          bestsellers_date: 1211587200000,
          published_date: 1212883200000,
          author: 'Chuck Palahniuk',
          description:
            'An aging porn queens aims to cap her career by having sex on film with 600 men in one day.',
          publisher: 'Doubleday',
          title: 'SNUFF',
          rank: 5,
          rank_last_week: 0,
          weeks_on_list: 1,
          id: '5b4aa4ead3089013507db18f'
        }]
      )
  });

  it('should sort by sort query', () => {
    
    const query = {sort: 'title'}
    let results = books.filter(book => book.title.toLowerCase().includes(''.toLowerCase()));
    const result = results.sort((a, b) => {
      return a[query.sort] > b[query.sort] ? 1 : a[query.sort] < b[query.sort] ? -1 : 0;
    })

    return callMyApp(app)
      .get('/books')
      .query(query)
      .expect(200, result)
  })


})