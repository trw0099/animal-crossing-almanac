import React from 'react';
import ReactDOM from 'react-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import NorthAnimals from './data/NorthernAnimals.json';
import SouthAnimals from './data/SouthernAnimals.json'
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
                        .map((animal, i) => {
                            return this.checkTime(animal) || this.props.show === "all" ? this.renderAnimal(i) : '';
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
            animalList: NorthAnimals,
            filter: "all",
            sort: "price",
            hemisphere: "north",
            show: "now"
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
        let animalList = this.state.hemisphere === "north" ?  NorthAnimals : SouthAnimals;

        let filteredAnimals = [].concat(animalList)
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
        if (filterType !== "fish" && filterType !== "bug" && filterType !== "all") {
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

    setHemisphere(hemisphere){
        this.setState({
            hemisphere: hemisphere
        });

        this.updateList(this.state.filter, this.state.sort);
    }

    show(option){
        this.setState({
            show: option
        })
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col xs="auto" className="mb-3">
                        <ToggleButtonGroup type="radio" name="animalType" defaultValue={'all'}>
                            <ToggleButton onClick={() => { this.filter("all") }} value={'all'} variant="secondary" title="Show all animals">All</ToggleButton>
                            <ToggleButton onClick={() => { this.filter("fish") }} value={'fish'} variant="primary" title="Show only fish"><FontAwesomeIcon icon={faFish} /></ToggleButton>
                            <ToggleButton onClick={() => { this.filter("bug") }} value={'bug'} variant="success" title="Show only bugs"><FontAwesomeIcon icon={faBug} /></ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                    <Col xs="auto" className="mb-3">
                        <ToggleButtonGroup type="radio" name="sortType" defaultValue={'price'}>
                            <ToggleButton onClick={() => { this.sort("price") }} value={'price'} variant="secondary" title="Sort by price">Price</ToggleButton>
                            <ToggleButton onClick={() => { this.sort("name") }} value={'name'} variant="secondary" title="Sort by name">Name</ToggleButton>
                            <ToggleButton onClick={() => { this.sort("location") }} value={'location'} variant="secondary" title="Sort by location">Location</ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                    <Col xs="auto" className="mb-3">
                        <ToggleButtonGroup type="radio" name="listType" defaultValue={'north'}>
                            <ToggleButton onClick={() => { this.setHemisphere("north") }} value={'north'} variant="secondary" title="Northern hemisphere">North</ToggleButton>
                            <ToggleButton onClick={() => { this.setHemisphere("south") }} value={'south'} variant="secondary" title="Southern hemisphere">South</ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                    <Col xs="auto" className="mb-3">
                        <ToggleButtonGroup type="radio" name="show" defaultValue={'now'}>
                            <ToggleButton onClick={() => { this.show("now") }} value={'now'} variant="secondary" title="Show animals available now">Now</ToggleButton>
                            <ToggleButton onClick={() => { this.show("all") }} value={'all'} variant="secondary" title="Show all animals">All</ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                    <Col xs={12} sm>
                        <p className="float-right time">
                            <b>{this.state.time}</b>
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>

                    </Col>
                </Row>
                <AnimalList month={this.state.month} hour={this.state.hour} show={this.state.show} animalList={this.state.animalList} />
            </Container>
        );
    }
}

// ========================================

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
