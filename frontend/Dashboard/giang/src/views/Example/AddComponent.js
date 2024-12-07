import React from "react";

class AddComponent extends React.Component {
    state = {
        title: '',
        salary: '',
    }
    handlechangetitleJob = (event) => {
        this.setState({
            title: event.target.value
        })
    }
    handlechangesalary = (event) => {
        this.setState({
            salary: event.target.value
        })

    }
    handleSubmit = (event) => {
        event.preventDefault()
        if (!this.state.title || !this.state.salary) {
            alert('Missing required params')
            return;
        }
        alert('Gui thanh cong')
        this.props.addNewJob({
            id: Math.floor(Math.random() * 1001),
            title: this.state.title,
            salary: this.state.salary
        })
        this.setState({
            title: '',
            salary: ''
        })
    }
    render() {
        return (
            <>
                <form  >
                    <label htmlFor="fname">Jobtitle:</label><br />
                    <input type="text" value={this.state.title}
                        onChange={(event) => this.handlechangetitleJob(event)}

                    />
                    <br />
                    <label htmlFor="lname">Salary:</label><br />
                    <input type="text" value={this.state.salary}
                        onChange={(event) => this.handlechangesalary(event)}


                    />

                    <br /><br />
                    <input type="submit"
                        onClick={(event) => this.handleSubmit(event)}
                    />
                </form>
            </>

        )
    }
}
export default AddComponent;