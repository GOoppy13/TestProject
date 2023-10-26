import React, { Component } from 'react';
import Loader from './Loader';
import Pagination from './Pagination';

export class Weather extends Component {
  static displayName = Weather.name;

  dateRef;
  timeRef;

  constructor(props) {
    super(props);
    this.state = { forecasts: [], loading: false, date: null, time: null, page: 0, total: 0 };
    this.dateRef = React.createRef();
    this.timeRef = React.createRef();

    this.renderForecastsTable = this.renderForecastsTable.bind(this);
    this.onChageDate = this.onChageDate.bind(this);
    this.onChangeTime = this.onChangeTime.bind(this);
    this.fetchWeatherData = this.fetchWeatherData.bind(this);
    this.onNextPageClick = this.onNextPageClick.bind(this);
    this.onPrevPageClick = this.onPrevPageClick.bind(this);
  }

  componentDidMount() {
    this.fetchWeatherData();
  }

  fetchWeatherData() {
    const { date, time, page } = this.state;
    this.setState({ loading: true })

    const query = !!date || !!time ? (
      !!date && !!time ? `?time=${time}&date=${date}` 
      : (!!date ? `?date=${date}` : `?time=${time}`)
    ) 
    : '';

    fetch(`api/weathers${query.concat(query.includes('?') ? `&skip=${page * 10}` : `?skip=${page * 10}`)}`)
      .then(resp => resp.json())
      .then(data => this.setState({ forecasts: data['weathers'], loading: false, 
        total: Number.isInteger(data['total'] / 10) ? data['total'] / 10 : Math.trunc(data['total'] / 10) + 1 }))
      .catch(() => this.setState({ loading: false }));
  }

  onChageDate() {
    this.setState({ date: this.dateRef.current.value.length > 0 ? new Date(this.dateRef.current.value).toLocaleDateString() : null, page: 0 },
    () => this.fetchWeatherData());
  }

  onChangeTime() {
    this.setState({ time: this.timeRef.current.value != '--:--' ? this.timeRef.current.value : null, page: 0 },
      () => this.fetchWeatherData());
  }

  onNextPageClick() {
    const { page } = this.state;
    this.setState({ page: page + 1 }, () => this.fetchWeatherData());
  }

  onPrevPageClick() {
    const { page } = this.state;
    this.setState({ page: page - 1 }, () => this.fetchWeatherData());
  }

  renderForecastsTable() {
    const { forecasts, page, total } = this.state;
    if (forecasts.length == 0) {
      return <h4>No data</h4>;
    }

    return (
      <>
        <table className="table table-striped" aria-labelledby="tableLabel">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Время</th>
              <th>Температура</th>
              <th>Влажность</th>
              <th>Точка росы</th>
              <th>Давление</th>
              <th>Направление ветера</th>
              <th>Скорость ветра</th>
              <th>Облачность</th>
              <th>Нижняя граница облачности</th>
              <th>Горизонтальная видимость</th>
              <th>Погодные явления</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map(forecast =>
              <tr key={forecast.Id}>
                <td>{forecast.Date}</td>
                <td>{forecast.Time}</td>
                <td>{forecast.Temperature}</td>
                <td>{forecast.Humidity}</td>
                <td>{forecast.DewPoint}</td>
                <td>{forecast.Pressure}</td>
                <td>{forecast.WindDirection}</td>
                <td>{forecast.WindSpeed}</td>
                <td>{forecast.CloudCover}</td>
                <td>{forecast.LowerCloudLimit}</td>
                <td>{forecast.HorVisibility}</td>
                <td>{forecast.Phenomena}</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination onNextPageClick={this.onNextPageClick} onPrevPageClick={this.onPrevPageClick} 
          nav={{ current: page + 1, total: total }}
          disable={{left: page == 0, right: page == total - 1}} />
      </>
    );
  }

  render() {
    const { loading } = this.state;
    return (
      <div>
        <h1>Weather</h1>
        <div style={{marginBottom: 8}}>
          Date: <input style={{marginRight: 8}} ref={this.dateRef} type="date" onChange={this.onChageDate}/>
          Time: <select ref={this.timeRef} name="from" id="from" onChange={this.onChangeTime}>
            <option value={'--:--'}>--:--</option>
            {[...Array(24).keys()].map((i) => {
              const value = String(i).length > 1 ? `${i}:00` : `0${i}:00`
              return <option key={i} value={value}>{value}</option>
            })}
          </select>
        </div>
        {!loading ? this.renderForecastsTable() : <Loader/>}
      </div>
    );
  }
}
