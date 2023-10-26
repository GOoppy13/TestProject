import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div>
        <h1>Это тестовый проект</h1>
        <p>Для его написания использовал предложенный, Visual Studio, template - ASP.NET Core + ReactJS</p>
      </div>
    );
  }
}
