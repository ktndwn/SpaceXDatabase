
let data = null
let filters = {
    sorting: 'descending',
    hideUpcoming: false,
    search: ''
}


//
//
//  Contacting the SpaceX API
//
//



let getData = () => {
    fetch('https://api.spacexdata.com/v2/launches/all', {}).then((response) => {
        if (response.status !== 200) {
            console.log(`Error Code: ${response.status}`)
        } else {
            console.log('Success')
            response.json().then((fetch) => {
                data = fetch            
                filterData(data, filters)
            })
        }
    })
}

getData()



//
//
// Filtering the data based on selected filters
//
//



let filterData = (data, filters) => {
    if (filters.sorting == 'descending') {
        data.sort((a,b) => b.flight_number - a.flight_number) 
    } else if (filters.sorting == 'ascending') {
        data.sort((a,b) => a.flight_number - b.flight_number)
    }


    if (filters.hideUpcoming == true) {
        data = data.filter((launch) => launch.launch_success !== null)
        
    }

    data = data.filter((launch) => launch.mission_name.toLowerCase().includes(filters.search.toLowerCase()))

    writeToDOM(data)
}




//
//
// DOM stuff
//
//




let writeToDOM = (data) => {
    data.forEach((launch) => {
        let launchDiv = document.createElement('div')
        launchDiv.setAttribute('class', 'launch')
        document.querySelector('#data-display').appendChild(launchDiv)





        let flightMissionDiv = document.createElement('div')
        launchDiv.appendChild(flightMissionDiv)
        flightMissionDiv.setAttribute('class', 'flight-mission')
        let link = null
            if (launch.links.wikipedia == null) {
                link = 'http://www.spaceflightinsider.com/launch-schedule/'
            } else {
                link = launch.links.wikipedia
            }
        flightMissionDiv.innerHTML = `#${launch.flight_number} <a href=${link} target="_blank">${launch.mission_name}</a>`





        let flightStatusDiv = document.createElement('div')
        let status = null
        flightStatusDiv.setAttribute('class', 'flight-status')
            if (launch.launch_success == false) {
                status = '<span class="fail">FAIL</span>'
            } else if (launch.launch_success == true) {
                status = '<span class="success">SUCCESS</span>'
            } else {
                status = '<span class="upcoming">UPCOMING</span>'
            }
        launchDiv.appendChild(flightStatusDiv)
        flightStatusDiv.innerHTML = `Status: ${status}`





        let contentDiv = document.createElement('div')
        launchDiv.appendChild(contentDiv)
        contentDiv.setAttribute('class', 'content')
        let date = new Date(launch.launch_date_utc).toString().slice(4, 15)
        let telemetryLink = null
            if (launch.telemetry.flight_club == null) {
                telemetryLink = 'No telemetry provided'
            } else {
                telemetryLink = `<a href=${launch.telemetry.flight_club} target="_blank">Link</a>`
            }
        let youtubeLink = null
            if (launch.links.video_link == null) {
                youtubeLink = 'No video link provided'
            } else {
                youtubeLink = `<a href=${launch.links.video_link} target="_blank">Link</a>`
            }
        contentDiv.innerHTML = 
        `<span class="title">Launch Date:</span><br>${date}<br>
        <span class="title">Rocket:</span><br>${launch.rocket.rocket_name} ${launch.rocket.rocket_type}<br>
        <span class="title">Video:</span><br>${youtubeLink}<br>
        <span class="title">Telemetry:</span><br>${telemetryLink}<br>
        <span class="title">Launch Location:</span><br><a href="http://www.google.com/search?q=${launch.launch_site.site_name_long}&btnI" target="_blank">${launch.launch_site.site_name_long}</a>`

        



        let patchDiv = document.createElement('img')
        launchDiv.appendChild(patchDiv)
        let patchImg = null
            if (launch.links.mission_patch == null) {
                patchImg = 'assets/spacex.png'
            } else {
                patchImg = launch.links.mission_patch
            }
        patchDiv.setAttribute('src', patchImg)






        let detailsDiv = document.createElement('div')
        let info = null
            if (launch.details == null) {
                info = 'No information provided.'
            } else {
                info = launch.details
            }
        launchDiv.appendChild(detailsDiv)
        detailsDiv.setAttribute('class', 'details')
        detailsDiv.innerHTML = `<span class="title">Info:</span><br>${info}`







    })
}




//
//
// Event listeners for sort options
//
//




document.querySelector('#sort').addEventListener('change', (e) => {
    if (e.target.value == 'descending') {
        filters.sorting = 'descending'
    } else if (e.target.value == 'ascending') {
        filters.sorting = 'ascending'
    }
    document.querySelector('#data-display').innerHTML = ''
    filterData(data, filters)
})


document.querySelector('#checkbox').addEventListener('change', (e) =>{
    if (e.target.checked) {
        filters.hideUpcoming = true
    } else {
        filters.hideUpcoming = false
    }
    document.querySelector('#data-display').innerHTML = ''
    filterData(data, filters)
})


document.querySelector('#search').addEventListener('input', (e) => {
    filters.search = e.target.value
    document.querySelector('#data-display').innerHTML = ''
    filterData(data, filters)
})