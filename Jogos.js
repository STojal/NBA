const options = {
    method: 'GET',
    url: 'https://football-highlights-api.p.rapidapi.com/matches',
    params: {
      leagueName: 'NBA',
      season: '2023',
      countryCode: 'EUA',
      leagueId: '97798',
      countryName: 'United States of America',
      limit: '20',
      date: '2023-12-15'
    },
    headers: {
      'X-RapidAPI-Key': 'cbde177a87msh72f4a6bdae95553p1b34ddjsnd31de1fff2f8',
      'X-RapidAPI-Host': 'football-highlights-api.p.rapidapi.com'
    }
  };
  
  try {
      const response = await axios.request(options);
      console.log(response.data);
  } catch (error) {
      console.error(error);
  }
  // not working