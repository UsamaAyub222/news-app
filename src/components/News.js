import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export class News extends Component {
  static defaultProps = {
    category: "general",
  };
  static propTypes = {
    category: PropTypes.string,
    pageSize: PropTypes.number,
  };
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0,
      pageSize: 8,
      text: " ",
      startDate: null,
    };
  }
  updateNews = async () => {
    this.props.setProgress(10);
    let api_url = `https://newsapi.org/v2/top-headlines?country=us&language=en&category=${this.props.category}&apiKey=2c62d4c4602343d6911523a4a51c791d&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(api_url);
    this.props.setProgress(30);
    let parseData = await data.json();
    this.props.setProgress(70);
    this.setState({
      articles: parseData.articles,
      totalResults: parseData.totalResults,
      loading: false,
      text: " Hello....",
      startDate: new Date(),
    });
    this.props.setProgress(100);
  }
  async componentDidMount() {

    await this.updateNews();

  }

  prevClick = async () => {
    let api_url = `https://newsapi.org/v2/top-headlines?language=en&category=${this.props.category}&apiKey=9dc9c311ef4f4a5bbceea4ee04b5a805&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(api_url);
    let parseData = await data.json();
    this.setState({ articles: parseData.articles });
    this.setState({
      page: this.state.page - 1,
      articles: parseData.articles,
      loading: false,
    });
  };
  nextClick = async () => {
    if (
      !(
        this.state.page + 1 >
        Math.ceil(this.state.totalResults / this.props.pageSize)
      )
    ) {
      let api_url = `https://newsapi.org/v2/top-headlines?language=en&category=${this.props.category
        }&apiKey=9dc9c311ef4f4a5bbceea4ee04b5a805&page=${this.state.page + 1
        }&pageSize=${this.props.pageSize}`;
      this.setState({ loading: true });
      let data = await fetch(api_url);
      let parseData = await data.json();
      this.setState({ articles: parseData.articles });
      this.setState({
        page: this.state.page + 1,
        articles: parseData.articles,
        loading: false,
      });
    }
  };
  fetchMoreData = async () => {
    //this.props.setProgress(10);

    let api_url = `https://newsapi.org/v2/top-headlines?country=us&language=en&category=${this.props.category}&apiKey=2c62d4c4602343d6911523a4a51c791d&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
    this.setState({ page: this.state.page + 1 });
    let data = await fetch(api_url);
    let parseData = await data.json();
    //this.props.setProgress(100);
    this.setState({
      articles: this.state.articles.concat(parseData.articles),
      totalResults: parseData.totalResults,
      text: " Hello....111111"
    });

    console.log(parseData.totalResults);


  };
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  addDays=(date, days)=> {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  render() {
    return (
      <>
        <h2 className="text-center my-3" style={{ paddingTop: '55px' }}>Top - {this.capitalizeFirstLetter(this.props.category)} News.</h2>
        <DatePicker
          selected={this.state.startDate}
          onChange={(date) => this.state.startDate}
          includeDates={[new Date(), this.addDays(new Date(), 1)]}
          placeholderText="This only includes today and tomorrow"
        />
        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {this.state.articles.map((element, index) => {
                return (
                  <div className="col-md-4 my-2" key={index}>
                    <NewsItem
                      title={element.title ? element.title.slice(0, 50) : "Unknown ..."}
                      description={
                        element.description
                          ? element.description.slice(0, 90)
                          : ""
                      }
                      imgUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
  }
}

export default News;
