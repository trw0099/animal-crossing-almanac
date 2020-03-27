import React from 'react';
import ReactDOM from 'react-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Animals from './data/NorthernAnimals.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFish, faBug } from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function Animal(props) {
    return (
        <Col md={4}>
            <Card bg={props.value.Type === "fish" ? "primary" : "success"} text="white">
                <Card.Header>
                    {props.value.Name}
                    <span className="float-right">
                        <FontAwesomeIcon icon={props.value.Type === "fish" ? faFish : faBug} />
                    </span>
                </Card.Header>
                <Card.Body>
                    <Card.Text>{props.value.Location}<span className="float-right">${props.value.Price}</span></Card.Text>
                    <Card.Text>{props.value.TimesString}<span className="float-right">{props.value.SeasonsString}</span></Card.Text>
                </Card.Body>
            </Card>
        </Col>
    );
}

class AnimalList extends React.Component {
    renderAnimal(i) {
        return <Animal
            key={i}
            value={this.props.animalList[i]}
        />;
    }

    checkTime(animal) {
        var validTime = false;
        var validMonth = false;

        if (animal.Times[0].All) {
            validTime = true;
        }
        else {
            animal.Times.forEach((time) => {
                if (time.Start < time.End && (time.Start <= this.props.hour && time.End > this.props.hour)) {
                    validTime = true;
                }
                else if (time.Start > time.End && (time.Start <= this.props.hour || time.End > this.props.hour)) {
                    validTime = true;
                }
            });
        }

        if (!validTime) {
            return false;
        }

        if (animal.Seasons[0].All) {
            return true;
        }
        else {
            animal.Seasons.forEach((season) => {
                if (season.Start < season.End && (season.Start <= this.props.month && season.End >= this.props.month)) {
                    validMonth = true;
                }
                else if (season.Start > season.End && (season.Start <= this.props.month || season.End >= this.props.month)) {
                    validMonth = true;
                }
            });
        }

        return validMonth;
    }

    render() {
        return (
            <Row>
                {
                    this.props.animalList
                        .map((fish, i) => {
                            return this.checkTime(fish) ? this.renderAnimal(i) : '';
                        })
                }
            </Row>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            time: new Date().toLocaleString([], { dateStyle: 'long', timeStyle: 'short' }),
            month: new Date().getMonth() + 1,
            hour: new Date().getHours(),
            animalList: Animals,
            filter: "all",
            sort: "price"
        };
    }

    componentDidMount() {
        this.intervalID = setInterval(
            () => this.tick(),
            60000
        );

        this.updateList(this.state.filter, this.state.sort);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    tick() {
        this.setState({
            time: new Date().toLocaleString([], { dateStyle: 'long', timeStyle: 'short' }),
            month: new Date().getMonth() + 1,
            hour: new Date().getHours()
        });
    }

    updateList(filter, sort) {
        let filteredAnimals = [].concat(Animals)
            .filter((animal) => {
                return filter === "all" || filter === animal.Type;
            });

        let sortedAnimals = [].concat(filteredAnimals)
            .sort((a, b) => {
                if (sort === "price") {
                    return b.Price - a.Price;
                }
                else if (sort === "location") {
                    if (a.Location < b.Location) {
                        return -1;
                    }
                    if (a.Location > b.Location) {
                        return 1;
                    }
                    return 0;
                }
                else {
                    if (a.Name < b.Name) {
                        return -1;
                    }
                    if (a.Name > b.Name) {
                        return 1;
                    }
                    return 0;
                }
            });

        this.setState({
            animalList: sortedAnimals,
            filter: filter,
            sort: sort
        });
    }

    filter(filterType) {
        if (filterType !== "fish" && filterType !== "insect" && filterType !== "all") {
            alert("Invalid filter");
        }

        this.updateList(filterType, this.state.sort)
    }

    sort(sortType) {
        if (sortType !== "price" && sortType !== "location" && sortType !== "name") {
            alert("Invalid sort");
        }

        this.updateList(this.state.filter, sortType)
    }


    render() {
        return (
            <Container>
                <Row>
                    <Col md={6}>
                        <h1>Animal Crossing Almanac</h1>
                    </Col>
                    <Col md={6}>
                        <p className="float-right time">
                            <b>{this.state.time}</b>
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col md="auto" className="mb-3">
                        <ToggleButtonGroup type="radio" name="options" defaultValue={'all'}>
                            <ToggleButton onClick={() => { this.filter("all") }} value={'all'} variant="secondary">All</ToggleButton>
                            <ToggleButton onClick={() => { this.filter("fish") }} value={'fish'} variant="primary"><FontAwesomeIcon icon={faFish} /></ToggleButton>
                            <ToggleButton onClick={() => { this.filter("insect") }} value={'insects'} variant="success"><FontAwesomeIcon icon={faBug} /></ToggleButton>
                        </ToggleButtonGroup>

                    </Col>
                    <Col className="mb-3">
                        <ToggleButtonGroup type="radio" name="options" defaultValue={'price'}>
                            <ToggleButton onClick={() => { this.sort("price") }} value={'price'} variant="secondary">Price</ToggleButton>
                            <ToggleButton onClick={() => { this.sort("name") }} value={'name'} variant="secondary">Name</ToggleButton>
                            <ToggleButton onClick={() => { this.sort("location") }} value={'location'} variant="secondary">Location</ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>

                    </Col>
                </Row>
                <AnimalList month={this.state.month} hour={this.state.hour} animalList={this.state.animalList} />
            </Container>
        );
    }
}

// ========================================

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
