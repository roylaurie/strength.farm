'use strict';

function index() {
    new DomViewEngine().init('index').then((indexTemplate) => {
        const dailyTemplate = indexTemplate.getTemplate('daily');

        for (let workoutName in WorkoutsToday) {
            let workout = WorkoutsToday[workoutName];
            let workoutTemplate = dailyTemplate.addTemplate('daily/workout');
            workoutTemplate.bindValues({
                'title': workout.getName(),
            });

            for (let exerciseName in workout.getExercises()) {
                let exercise = workout.getExercise(exerciseName);
                let exerciseTemplate = workoutTemplate.addTemplate('daily/workout/exercise');
                exerciseTemplate.bindValues({
                    'title': exercise.getName(),
                    'image': { attr: { src: 'img/foo.png' } },
                    'goal': exercise.getGoal(),
                    'done': exercise.getDone(),
                    'input': exercise.getDefaultReps();
                });
            }
        }


        indexTemplate.refresh();
    });

    return;


    let date = new Date();
    let datetoday = date.getFullYear() + '' + (date.getMonth() + 1) + '' + date.getDate();

    for (let key in WorkoutsToday) {
        let workout = WorkoutsToday[key];
        let workoutPlan = workout.workoutPlan;
        let workoutsTodayElement = document.getElementById('workoutsToday');

        let workoutElement = document.createElement('div');
        workoutElement.innerHTML = '<h4>' + workoutPlan.label + '</h4>';

        for (let i = 0; i < workoutPlan.exercises.length; ++i) {
            let exercise = workoutPlan.exercises[i];

            for (let k = 0; k < exercise.exerciseSetGoals.length; ++k) {
                let exerciseMeasurement = exercise.exerciseSetGoals[k];
                let measurementId =  'workout-' + workoutPlan.token + '-' + datetoday
                    + '.exercise-' + exercise.exerciseType.token + '.' + exerciseMeasurement.exerciseMeasurementType.token;

                let exerciseMeasurementValue = Number.parseInt(window.localStorage.getItem(measurementId)) || 0;

                let exerciseElement = document.createElement('div');
                exerciseElement.innerHTML = '<label>' + exercise.exerciseType.labelPlural + ' </label>'
                    + '<span id="' + measurementId + '">' + exerciseMeasurementValue + ' ' + exerciseMeasurement.exerciseMeasurementType.unitOfMeasurement + '</span>';

                workoutElement.appendChild(exerciseElement);
            }
        }

        let buttonsElement = document.createElement('div');
        buttonsElement.innerHTML = '<button class="completeSetButton" id="button-addset-' + workoutPlan.token + '" type="button">complete</button>';

        workoutElement.appendChild(buttonsElement);
        workoutsTodayElement.appendChild(workoutElement);
    }

    let buttonsElements = document.getElementsByClassName('completeSetButton');
    for (let i = 0; i < buttonsElements.length; ++i) {
        buttonsElements[i].addEventListener('click', (event) => {
            let workoutId = buttonsElements[i].id.substring(14);
            let workout = WorkoutsToday[workoutId];
            let workoutPlan = workout.workoutPlan;

            for (let j = 0; j < workoutPlan.exercises.length; ++j) {
                let exercise = workoutPlan.exercises[j];
                let exerciseMeasurements = [];

                for (let k = 0; k < exercise.exerciseSetGoals.length; ++k) {
                    let exerciseSetGoal = exercise.exerciseSetGoals[k];
                    exerciseMeasurements.push(new ExerciseMeasurement(exerciseSetGoal.exerciseMeasurementType, exerciseSetGoal.value));

                    // todo: build model record first
                    // workout.addWorkoutSet(new WorkoutSet(exercise.exerciseType,
                    //    new ExerciseMeasurementCollection(exerciseType, exerciseMeasurements)));

                    let id = 'workout-' + workoutPlan.token + '-' + datetoday
                        + '.exercise-' + exercise.exerciseType.token + '.' + exerciseSetGoal.exerciseMeasurementType.token;

                    let value = Number.parseInt(window.localStorage.getItem(id)) || 0;
                    value += exerciseSetGoal.value;

                    window.localStorage.setItem(id, '' + value);

                   let repElement = document.getElementById(id).innerText = value + ' ' + exerciseSetGoal.exerciseMeasurementType.unitOfMeasurement;
                }

            }
        });
    }
};