document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    // Navigation
    const landingPage = document.getElementById('landing-page');
    const appContent = document.getElementById('app-content');
    const exerciseTrackerSection = document.getElementById('exercise-tracker');
    const bodyMetricsSection = document.getElementById('body-metrics-tracker');
    const goToExerciseButton = document.getElementById('goto-exercise-tracker');
    const goToMetricsButton = document.getElementById('goto-body-metrics');
    const backButtons = document.querySelectorAll('.back-button');

    // Exercise Tracking
    const exerciseForm = document.getElementById('exercise-form');
    const exerciseSelectionGrid = document.getElementById('exercise-selection-grid');
    const selectedExerciseNameInput = document.getElementById('selected-exercise-name');
    // ---
    const newExerciseGroup = document.getElementById('new-exercise-group');
    const exerciseNameNewInput = document.getElementById('exercise-name-new');
    const exerciseRepsInput = document.getElementById('exercise-reps');
    const exerciseWeightInput = document.getElementById('exercise-weight');
    const exerciseListDiv = document.getElementById('exercise-list');
    const exerciseSelectChart = document.getElementById('exercise-select-chart');
    const exerciseChartCanvas = document.getElementById('exercise-chart');
    // New elements for table view..
    const showExerciseTableButton = document.getElementById('show-exercise-table-btn');
    const exerciseTableContainer = document.getElementById('exercise-table-container');


    const metricsForm = document.getElementById('metrics-form');
    const metricDateInput = document.getElementById('metric-date');
    const metricWeightInput = document.getElementById('metric-weight');
    const metricBodyfatInput = document.getElementById('metric-bodyfat');
    const metricMusclemassInput = document.getElementById('metric-musclemass');
    const metricsHistoryDiv = document.getElementById('metrics-history');
    const metricSelectChart = document.getElementById('metric-select-chart');
    const metricsChartCanvas = document.getElementById('metrics-chart');

    // --- Chart Instances ---
    let exerciseChartInstance = null;
    let metricsChartInstance = null;

    // --- Data Storage ---
    // Exercises: { "Exercise Name": [{date: timestamp, reps: number, weight: number}, ...], ... }
    // Metrics: [{date: "YYYY-MM-DD", weight: number, bodyfat: number, musclemass: number}, ...]
    let exercises = JSON.parse(localStorage.getItem('gymExercises')) || {};
    let metrics = JSON.parse(localStorage.getItem('gymMetrics')) || [];

    // --- Helper Functions ---
    const saveData = () => {
        localStorage.setItem('gymExercises', JSON.stringify(exercises));
        localStorage.setItem('gymMetrics', JSON.stringify(metrics));
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString + 'T00:00:00').toLocaleDateString(undefined, options); // Adjust for timezone
    };

    // --- Navigation Logic ---
    const showLandingPage = () => {
        landingPage.classList.remove('hidden');
        appContent.classList.add('hidden');
        exerciseTrackerSection.classList.add('hidden');
        bodyMetricsSection.classList.add('hidden');
    };

    const showAppSection = (sectionId) => {
        landingPage.classList.add('hidden');
        appContent.classList.remove('hidden');
        // Hide both sections first
        exerciseTrackerSection.classList.add('hidden');
        bodyMetricsSection.classList.add('hidden');
        // Show the target section
        if (sectionId === 'exercise-tracker') {
            exerciseTrackerSection.classList.remove('hidden');
            // Reset chart dropdown and clear chart when entering this section
            exerciseSelectChart.value = "";
            if (exerciseChartInstance) {
                exerciseChartInstance.destroy();
                exerciseChartInstance = null;
            }
            // Also hide the table and reset button/margin
            exerciseTableContainer.innerHTML = '';
            exerciseTableContainer.classList.add('hidden');
            exerciseTableContainer.classList.remove('block');
            showExerciseTableButton.textContent = 'Show Full History Table';
            showExerciseTableButton.classList.add('hidden'); // Hide button initially
            showExerciseTableButton.classList.remove('inline-block');
            // Reset margin potentially added by table display
            bodyMetricsSection.style.marginTop = ''; 
        } else if (sectionId === 'body-metrics-tracker') {
            bodyMetricsSection.classList.remove('hidden');
            // Optionally reset metrics chart dropdown if needed in future
            // metricSelectChart.value = "weight"; // Or some default
            // renderMetricsChart(metricSelectChart.value);
        }
    };

    // --- Exercise Card Selection Logic ---
    const handleExerciseCardClick = (event) => {
        const selectedCard = event.currentTarget;
        const exerciseName = selectedCard.dataset.exerciseName; // Get name from data attribute

        // Remove selected style from all cards
        exerciseSelectionGrid.querySelectorAll('.exercise-card').forEach(card => {
            card.classList.remove('ring-2', 'ring-purple-500', 'bg-gray-600');
            card.classList.add('bg-gray-700/50', 'hover:bg-gray-700');
        });

        if (exerciseName === '--new--') {
            // Handle "Add New" card click
            selectedCard.classList.add('ring-2', 'ring-yellow-500', 'bg-gray-600'); // Highlight Add New card
            selectedExerciseNameInput.value = ''; // Clear selected exercise hidden input
            newExerciseGroup.style.display = 'block'; // Show the new name input field
            exerciseNameNewInput.required = true;
            exerciseNameNewInput.focus();
        } else {
            // Handle existing exercise card click
            selectedCard.classList.add('ring-2', 'ring-purple-500', 'bg-gray-600'); // Highlight selected card
            selectedExerciseNameInput.value = exerciseName; // Set hidden input value
            newExerciseGroup.style.display = 'none'; // Hide the new name input field
            exerciseNameNewInput.required = false;
            exerciseNameNewInput.value = ''; // Clear new name input just in case
        }
    };

    // --- Exercise Tracking ---
    const renderExerciseList = () => {
        exerciseListDiv.innerHTML = ''; // Clear current list display
        exerciseSelectChart.innerHTML = '<option value="">-- Select Exercise for Chart --</option>'; // Clear chart dropdown
        exerciseSelectionGrid.innerHTML = ''; // Clear exercise selection grid

        const sortedExerciseNames = Object.keys(exercises).sort();

        // Create cards for existing exercises
        sortedExerciseNames.forEach(name => {
            // Add to chart dropdown
             const chartOption = document.createElement('option');
             chartOption.value = name;
             chartOption.textContent = name;
             exerciseSelectChart.appendChild(chartOption);

             // Create Exercise Card for Selection Grid
             const cardDiv = document.createElement('div');
             cardDiv.classList.add('exercise-card', 'bg-gray-700/50', 'p-3', 'rounded-lg', 'shadow-md', 'border', 'border-gray-600', 'text-center', 'cursor-pointer', 'transition', 'duration-200', 'hover:bg-gray-700', 'hover:border-purple-500');
             cardDiv.dataset.exerciseName = name; // Store name in data attribute
             cardDiv.innerHTML = `<span class="block text-sm font-medium text-gray-200 truncate">${name}</span>`;
             cardDiv.addEventListener('click', handleExerciseCardClick);
             exerciseSelectionGrid.appendChild(cardDiv);

            // Add to tracked exercises list display (if history exists)
            const history = exercises[name];
            if (history.length === 0) return; // Skip if no history

            const latestEntry = history[history.length - 1]; // Get the most recent entry

            // Add to list display (Dark Theme)
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('bg-gray-700/50', 'p-4', 'rounded-lg', 'shadow-md', 'border-l-4', 'border-purple-500', 'flex', 'flex-wrap', 'justify-between', 'items-center', 'gap-3', 'transition', 'duration-300', 'hover:bg-gray-700');
            itemDiv.innerHTML = `
                <span class="font-semibold text-purple-300 text-lg">${name}</span>
                <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <span class="text-gray-300">Max Reps: <span class="font-medium text-gray-100">${latestEntry.reps}</span></span>
                    <span class="text-gray-300">Max Weight: <span class="font-medium text-gray-100">${latestEntry.weight}</span></span>
                </div>
                <span class="text-gray-400 text-xs italic">Last Updated: ${formatDate(new Date(latestEntry.date).toISOString().split('T')[0])}</span>
                <button data-exercise-name="${name}" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-medium transition duration-300 transform hover:scale-105">Delete</button>
            `;
            exerciseListDiv.appendChild(itemDiv);
        }); // END of sortedExerciseNames.forEach loop

        // Create "Add New Exercise" Card
        const addNewCard = document.createElement('div');
        addNewCard.classList.add('exercise-card', 'bg-yellow-600/30', 'p-3', 'rounded-lg', 'shadow-md', 'border', 'border-yellow-600/50', 'text-center', 'cursor-pointer', 'transition', 'duration-200', 'hover:bg-yellow-600/50', 'hover:border-yellow-500', 'flex', 'items-center', 'justify-center');
        addNewCard.dataset.exerciseName = '--new--';
        addNewCard.innerHTML = `<span class="block text-sm font-semibold text-yellow-300">+ Add New</span>`;
        addNewCard.addEventListener('click', handleExerciseCardClick);
        exerciseSelectionGrid.appendChild(addNewCard);


        // Add delete listeners to the tracked exercises list
        exerciseListDiv.querySelectorAll('button[data-exercise-name]').forEach(button => {
             button.addEventListener('click', handleDeleteExercise);
        });
    }; // END of renderExerciseList function

    // REMOVED handleExerciseNameSelectChange function

    const handleExerciseSubmit = (e) => {
        e.preventDefault();

        let name = selectedExerciseNameInput.value; // Get name from hidden input

        // Check if "Add New" was selected (hidden input is empty)
        if (!name) {
            name = exerciseNameNewInput.value.trim();
            if (!name) {
                alert('Please enter a name for the new exercise or select an existing one.');
                // Optional: Add visual feedback to the input field
                return;
            }
            // Check if the new name already exists (case-insensitive)
            const existingNames = Object.keys(exercises).map(n => n.toLowerCase());
            if (existingNames.includes(name.toLowerCase())) {
                 alert(`Exercise "${name}" already exists. Please select its card or enter a different name.`);
                 // Optional: Add visual feedback
                 return;
            }
            // New exercise is being added
        } else {
            // Existing exercise was selected via card
        }

        const reps = parseInt(exerciseRepsInput.value);
        const weight = parseFloat(exerciseWeightInput.value);
        const date = new Date().toISOString(); // Use current timestamp

        if (!name || isNaN(reps) || reps < 0 || isNaN(weight) || weight < 0) {
            alert('Please enter valid exercise details (Name, non-negative Reps and Weight).');
            return;
        }

        // Initialize if new exercise (name might be from new input)
        if (!exercises[name]) {
            exercises[name] = [];
        }

        // Add new record
        exercises[name].push({ date, reps, weight });
        // Sort records by date just in case (though pushing should maintain order)
        exercises[name].sort((a, b) => new Date(a.date) - new Date(b.date));

        saveData();
        renderExerciseList(); // Update list and dropdowns
        renderExerciseChart(name); // Update chart for the added/updated exercise
        exerciseSelectChart.value = name; // Select the updated exercise in chart dropdown
        exerciseForm.reset(); // Clear form inputs (reps, weight)
        selectedExerciseNameInput.value = ''; // Clear hidden input
        exerciseNameNewInput.value = ''; // Clear new name input
        newExerciseGroup.style.display = 'none'; // Hide new name group
        exerciseNameNewInput.required = false;
        // Remove selection style from all cards
        exerciseSelectionGrid.querySelectorAll('.exercise-card').forEach(card => {
            card.classList.remove('ring-2', 'ring-purple-500', 'ring-yellow-500', 'bg-gray-600');
            card.classList.add('bg-gray-700/50', 'hover:bg-gray-700');
        });
    };

    const handleDeleteExercise = (e) => {
        const exerciseName = e.target.getAttribute('data-exercise-name');
        if (confirm(`Are you sure you want to delete all data for "${exerciseName}"?`)) {
            delete exercises[exerciseName];
            saveData();
            renderExerciseList();
            // Clear chart if the deleted exercise was selected
            if (exerciseSelectChart.value === exerciseName) {
                 if (exerciseChartInstance) {
                    exerciseChartInstance.destroy();
                    exerciseChartInstance = null;
                 }
                 exerciseSelectChart.value = ""; // Reset chart dropdown
                 selectedExerciseNameInput.value = ""; // Clear selected name
            } else {
                // Re-render chart for currently selected exercise if it wasn't the deleted one
                renderExerciseChart(exerciseSelectChart.value);
            }
             // Clear selection state if the deleted card was selected
             const deletedCard = exerciseSelectionGrid.querySelector(`.exercise-card[data-exercise-name="${exerciseName}"]`);
             if (deletedCard && deletedCard.classList.contains('ring-2')) {
                 selectedExerciseNameInput.value = '';
             }
        }
    };

    const renderExerciseChart = (exerciseName) => {
        if (exerciseChartInstance) {
            exerciseChartInstance.destroy(); // Clear previous chart
            exerciseChartInstance = null;
        }
    // Clear and hide table whenever chart is re-rendered
    exerciseTableContainer.innerHTML = '';
    exerciseTableContainer.classList.add('hidden'); // Use hidden class instead of inline style
    exerciseTableContainer.classList.remove('block');
    showExerciseTableButton.textContent = 'Show Full History Table'; // Reset button text

    if (!exerciseName || !exercises[exerciseName] || exercises[exerciseName].length === 0) {
            // Optionally display a message saying "No data to display" or "Select an exercise"
            showExerciseTableButton.classList.add('hidden'); // Hide button if no data
            showExerciseTableButton.classList.remove('inline-block');
            return;
        } else {
             showExerciseTableButton.classList.remove('hidden'); // Show button if data exists
             showExerciseTableButton.classList.add('inline-block');
        }

        const history = exercises[exerciseName];
        const labels = history.map(entry => new Date(entry.date)); // Use Date objects for time scale
        // const repsData = history.map(entry => entry.reps); // No longer needed for chart
        const weightData = history.map(entry => entry.weight);

        const ctx = exerciseChartCanvas.getContext('2d');
        exerciseChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    // Removed Max Reps dataset
                    {
                        label: 'Max Weight',
                        data: weightData,
                        borderColor: 'rgb(192, 132, 252)', // Purple-400
                        backgroundColor: 'rgba(192, 132, 252, 0.2)',
                        pointBackgroundColor: 'rgb(192, 132, 252)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(192, 132, 252)',
                        tension: 0.2,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            tooltipFormat: 'MMM dd, yyyy',
                             displayFormats: { day: 'MMM dd' }
                        },
                        title: { display: true, text: 'Date', color: '#cbd5e1' }, // Light text
                        grid: { color: 'rgba(100, 116, 139, 0.3)' }, // Lighter grid lines
                        ticks: { color: '#cbd5e1' } // Light text
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Max Weight (kg/lbs)', color: '#cbd5e1' }, // Light text
                        beginAtZero: false, // Adjust based on data range
                        grid: { color: 'rgba(100, 116, 139, 0.3)' }, // Lighter grid lines
                        ticks: { color: '#cbd5e1' } // Light text
                    }
                },
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(31, 41, 55, 0.8)', // Dark tooltip
                        titleColor: '#e5e7eb',
                        bodyColor: '#d1d5db',
                        borderColor: 'rgba(100, 116, 139, 0.5)',
                        borderWidth: 1
                    },
                    title: {
                        display: true,
                        text: `Progress for ${exerciseName}`,
                        color: '#f3f4f6', // Light title
                        font: { size: 16 }
                    },
                    legend: {
                        labels: { color: '#d1d5db' } // Light legend text
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    };

    const renderExerciseTable = (exerciseName) => {
        exerciseTableContainer.innerHTML = ''; // Clear previous table
        if (!exerciseName || !exercises[exerciseName] || exercises[exerciseName].length === 0) {
            exerciseTableContainer.classList.add('hidden');
            exerciseTableContainer.classList.remove('block');
            return; // No data to display
        }

        const history = exercises[exerciseName];
        const table = document.createElement('table');
        table.classList.add('history-table', 'min-w-full'); // Add class for potential styling

        // Create header row (Dark Theme)
        const thead = table.createTHead();
        thead.classList.add('bg-gray-600/70');
        const headerRow = thead.insertRow();
        const headers = ['Date', 'Max Reps', 'Max Weight'];
        headers.forEach(text => {
            const th = document.createElement('th');
            th.classList.add('px-5', 'py-3', 'text-left', 'text-xs', 'font-semibold', 'text-gray-300', 'uppercase', 'tracking-wider', 'border-b', 'border-gray-500');
            th.textContent = text;
            headerRow.appendChild(th);
        });

        // Create body rows (reverse order - most recent first) (Dark Theme)
        const tbody = table.createTBody();
        [...history].reverse().forEach((entry, index) => {
            const row = tbody.insertRow();
            row.classList.add('border-b', 'border-gray-700', 'hover:bg-gray-600/50');
            
            const dateCell = row.insertCell();
            dateCell.classList.add('px-5', 'py-3', 'text-sm', 'text-gray-200');
            dateCell.textContent = formatDate(new Date(entry.date).toISOString().split('T')[0]);
            
            const repsCell = row.insertCell();
            repsCell.classList.add('px-5', 'py-3', 'text-sm', 'text-gray-200');
            repsCell.textContent = entry.reps;
            
            const weightCell = row.insertCell();
            weightCell.classList.add('px-5', 'py-3', 'text-sm', 'text-gray-200');
            weightCell.textContent = entry.weight;
        });

        exerciseTableContainer.appendChild(table);
        exerciseTableContainer.classList.remove('hidden');
        exerciseTableContainer.classList.add('block'); // Show the container
    };

     const handleShowExerciseTable = () => {
        const selectedExercise = exerciseSelectChart.value;
        // Check visibility based on the 'hidden' class
        const isTableVisible = !exerciseTableContainer.classList.contains('hidden');
        const bodyMetricsSection = document.getElementById('body-metrics-tracker');

        if (isTableVisible) {
            // Hide the table
            exerciseTableContainer.innerHTML = ''; // Clear content first
            exerciseTableContainer.classList.add('hidden'); // Add hidden class
            exerciseTableContainer.classList.remove('block'); // Remove block class
            showExerciseTableButton.textContent = 'Show Full History Table';
            bodyMetricsSection.style.marginTop = ''; // Reset inline margin style
        } else {
            // Render the table content first
            renderExerciseTable(selectedExercise);
            // Check if the table actually got content using hasChildNodes()
            if (exerciseTableContainer.hasChildNodes()) {
                 // Make the container visible *before* calculating height
                 exerciseTableContainer.classList.remove('hidden');
                 exerciseTableContainer.classList.add('block');
                 
                 // Calculate height *after* it's visible
                 const tableHeight = exerciseTableContainer.offsetHeight;
                 
                 // Apply dynamic margin using inline style
                 bodyMetricsSection.style.marginTop = `${tableHeight + 30}px`; // Add some extra spacing (30px)
                 
                 showExerciseTableButton.textContent = 'Hide Full History Table';
            } else {
                 // Ensure it stays hidden if no content was rendered
                 exerciseTableContainer.classList.add('hidden');
                 exerciseTableContainer.classList.remove('block');
            }
        }
    };


    // --- Body Metrics Tracking ---
    const renderMetricsHistory = () => {
        metricsHistoryDiv.innerHTML = ''; // Clear current history
        // Sort metrics by date descending (most recent first) for display
        const sortedMetrics = [...metrics].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedMetrics.forEach((metric, index) => {
            // Add to list display (Dark Theme)
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('bg-gray-700/50', 'p-4', 'rounded-lg', 'shadow-md', 'border-l-4', 'border-emerald-500', 'flex', 'flex-wrap', 'justify-between', 'items-center', 'gap-3', 'transition', 'duration-300', 'hover:bg-gray-700');
            
            let metricsHTML = `<div class="flex-grow">
                                <span class="font-semibold text-emerald-300 text-lg">${formatDate(metric.date)}</span>
                                <div class="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">`;
                
            if (metric.weight !== undefined && metric.weight !== null) 
                metricsHTML += `<span class="text-gray-300">Weight: <span class="font-medium text-gray-100">${metric.weight}</span></span>`;
            
            if (metric.bodyfat !== undefined && metric.bodyfat !== null) 
                metricsHTML += `<span class="text-gray-300">Body Fat: <span class="font-medium text-gray-100">${metric.bodyfat}%</span></span>`;
            
            if (metric.musclemass !== undefined && metric.musclemass !== null) 
                metricsHTML += `<span class="text-gray-300">Muscle Mass: <span class="font-medium text-gray-100">${metric.musclemass}</span></span>`;
            
            metricsHTML += `</div></div>`;

            entryDiv.innerHTML = `
                ${metricsHTML}
                <button data-metric-index="${metrics.indexOf(metric)}" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-medium transition duration-300 transform hover:scale-105">Delete</button>
            `; // Use original index for deletion
            metricsHistoryDiv.appendChild(entryDiv);
        });

         // Add delete listeners
        metricsHistoryDiv.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', handleDeleteMetric);
        });
    };

     const handleMetricsSubmit = (e) => {
        e.preventDefault();
        const date = metricDateInput.value;
        // Get values, treat empty strings as null
        const weight = metricWeightInput.value ? parseFloat(metricWeightInput.value) : null;
        const bodyfat = metricBodyfatInput.value ? parseFloat(metricBodyfatInput.value) : null;
        const musclemass = metricMusclemassInput.value ? parseFloat(metricMusclemassInput.value) : null;

        if (!date) {
            alert('Please select a date for the metric entry.');
            return;
        }
        if (weight === null && bodyfat === null && musclemass === null) {
             alert('Please enter at least one metric value (Weight, Body Fat, or Muscle Mass).');
            return;
        }
         // Basic validation for entered values
        if ((weight !== null && (isNaN(weight) || weight < 0)) ||
            (bodyfat !== null && (isNaN(bodyfat) || bodyfat < 0 || bodyfat > 100)) ||
            (musclemass !== null && (isNaN(musclemass) || musclemass < 0))) {
            alert('Please enter valid, non-negative numbers for the metrics.');
            return;
        }

        // Check if an entry for this date already exists
        const existingIndex = metrics.findIndex(m => m.date === date);
        const newEntry = { date, weight, bodyfat, musclemass };

        if (existingIndex > -1) {
            // Update existing entry - merge new values, keeping old ones if new are null
             metrics[existingIndex] = {
                ...metrics[existingIndex], // Keep existing date and other values
                ...(weight !== null && { weight }), // Update if not null
                ...(bodyfat !== null && { bodyfat }),
                ...(musclemass !== null && { musclemass }),
            };
             alert(`Metrics for ${formatDate(date)} updated.`);
        } else {
            // Add new entry
            metrics.push(newEntry);
            // Keep metrics sorted by date ascending for charting
            metrics.sort((a, b) => new Date(a.date) - new Date(b.date));
        }


        saveData();
        renderMetricsHistory();
        renderMetricsChart(metricSelectChart.value); // Update chart
        metricsForm.reset(); // Clear form
        metricDateInput.value = ''; // Explicitly clear date field as reset might not work consistently
    };

     const handleDeleteMetric = (e) => {
        const indexToDelete = parseInt(e.target.getAttribute('data-metric-index'));
         if (isNaN(indexToDelete) || indexToDelete < 0 || indexToDelete >= metrics.length) return; // Invalid index

        if (confirm(`Are you sure you want to delete the metric entry for ${formatDate(metrics[indexToDelete].date)}?`)) {
            metrics.splice(indexToDelete, 1); // Remove the entry
            saveData();
            renderMetricsHistory();
            renderMetricsChart(metricSelectChart.value); // Update chart
        }
    };

    const renderMetricsChart = (metricType) => {
        if (metricsChartInstance) {
            metricsChartInstance.destroy(); // Clear previous chart
            metricsChartInstance = null;
        }

        if (!metricType || metrics.length === 0) {
            return; // No metric selected or no data
        }

        // Filter out entries where the selected metric is null or undefined
        const filteredMetrics = metrics.filter(m => m[metricType] !== null && m[metricType] !== undefined);

        if (filteredMetrics.length === 0) {
             // Optionally display a message like "No data available for this metric"
            return;
        }


        const labels = filteredMetrics.map(entry => new Date(entry.date + 'T00:00:00')); // Use Date objects, adjust for timezone
        const data = filteredMetrics.map(entry => entry[metricType]);

        let yAxisLabel = '';
        switch (metricType) {
            case 'weight': yAxisLabel = 'Weight (kg/lbs)'; break;
            case 'bodyfat': yAxisLabel = 'Body Fat (%)'; break;
            case 'musclemass': yAxisLabel = 'Muscle Mass (kg/lbs)'; break;
        }

        const ctx = metricsChartCanvas.getContext('2d');
        metricsChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: yAxisLabel.split(' (')[0], // Cleaner label
                    data: data,
                    borderColor: 'rgb(45, 212, 191)', // Emerald-400
                    backgroundColor: 'rgba(45, 212, 191, 0.2)',
                    pointBackgroundColor: 'rgb(45, 212, 191)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(45, 212, 191)',
                    tension: 0.2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                         time: { unit: 'day', tooltipFormat: 'MMM dd, yyyy', displayFormats: { day: 'MMM dd' } },
                        title: { display: true, text: 'Date', color: '#cbd5e1' }, // Light text
                        grid: { color: 'rgba(100, 116, 139, 0.3)' }, // Lighter grid lines
                        ticks: { color: '#cbd5e1' } // Light text
                    },
                    y: {
                        title: { display: true, text: yAxisLabel, color: '#cbd5e1' }, // Light text
                        beginAtZero: false,
                        grid: { color: 'rgba(100, 116, 139, 0.3)' }, // Lighter grid lines
                        ticks: { color: '#cbd5e1' } // Light text
                    }
                },
                 plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(31, 41, 55, 0.8)', // Dark tooltip
                        titleColor: '#e5e7eb',
                        bodyColor: '#d1d5db',
                        borderColor: 'rgba(100, 116, 139, 0.5)',
                        borderWidth: 1
                    },
                    title: {
                        display: true,
                        text: `Body Metric Progress: ${yAxisLabel.split(' (')[0]}`,
                        color: '#f3f4f6', // Light title
                        font: { size: 16 }
                    },
                    legend: {
                        labels: { color: '#d1d5db' } // Light legend text
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    };

    // --- Event Listeners ---
    // Navigation Listeners
    goToExerciseButton.addEventListener('click', () => showAppSection('exercise-tracker'));
    goToMetricsButton.addEventListener('click', () => showAppSection('body-metrics-tracker'));
    backButtons.forEach(button => {
        button.addEventListener('click', showLandingPage);
    });

    // Form & Chart Listeners
    exerciseForm.addEventListener('submit', handleExerciseSubmit);
    metricsForm.addEventListener('submit', handleMetricsSubmit);
    exerciseSelectChart.addEventListener('change', (e) => renderExerciseChart(e.target.value));
    metricSelectChart.addEventListener('change', (e) => renderMetricsChart(e.target.value));
    showExerciseTableButton.addEventListener('click', handleShowExerciseTable);

    // --- Initial Load ---
    const initializeApp = () => {
        // Set default date for metrics form to today
        metricDateInput.valueAsDate = new Date();

        renderExerciseList();
        renderMetricsHistory();
        // Optionally render charts on load if there's data
        if (Object.keys(exercises).length > 0) {
             const firstExercise = Object.keys(exercises).sort()[0];
             exerciseSelectChart.value = firstExercise;
             renderExerciseChart(firstExercise);
        }
         if (metrics.length > 0) {
            renderMetricsChart(metricSelectChart.value); // Render chart for default selected metric
        }

        // Show landing page initially (it starts hidden by CSS animation class)
        // We don't call showLandingPage() here anymore as CSS handles initial state

        // Remove the initial animation class after the splash screen duration + fade
        // Splash display (3s) + Splash fade-out (1s) = 4s total
        setTimeout(() => {
            const landingPageElement = document.getElementById('landing-page');
            if (landingPageElement) {
                 landingPageElement.classList.remove('initial-hidden');
                 // Ensure opacity is set to 1 after removing the class controlling it
                 landingPageElement.style.opacity = '1'; 
            }
        }, 4000); // 4 seconds delay
    };

    initializeApp();
});
