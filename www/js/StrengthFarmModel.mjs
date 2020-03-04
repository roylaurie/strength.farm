'use strict';

import ExerciseType from 'model/ExerciseType.mjs';
import ExerciseMeasurementType from 'js/model/ExerciseMeasurementType.mjs';
import WorkoutPlan from 'js/model/WorkoutPlan.mjs';
import WorkoutExercise from 'js/model/WorkoutExercise.mjs';
import ExerciseMeasurement from 'js/model/ExerciseMeasurement.mjs';
import ExerciseCondition from 'js/model/ExerciseCondition.mjs';
import Workout from 'js/model/Workout.mjs';

export default class StrengthFarmModel {
    constructor() {
        throw new Error('Cannot instantiate abstract class');
    }
};

StrengthFarmModel.exerciseTypes = {
    'pushup': new ExerciseType('Push-Up', 'Push-Ups'),
    'pushup-widegrip': new ExerciseType('Wide Grip Push-Up', 'Wide Grip Push-Ups'),
    'crunch': new ExerciseType('Crunch', 'Crunches'),
    'curl': new ExerciseType(Curl, 'Curls'),
    'cycle': new ExerciseType('Cycling', 'Cycling'),
    'intimacy': new ExerciseType('Intimacy', 'Intimacy')
};

StrengthFarmModel.exerciseMeasurementTypes = {
    'repetition': new ExerciseMeasurementType('repetition', 'Repetition', 'Repetition', 'reps'),
    'duration': new ExerciseMeasurementType('duration', 'Duration', 'Duration', 'mins'),
    'weight': new ExerciseMeasurementType('weight', 'Weight', 'Weight', 'kg'),
    'heartrate': new ExerciseMeasurementType('heartrate', 'Heart Rate', 'Heart Rate', 'bpm'),
    'heartrate-average': new ExerciseMeasurementType('heartrate-average', 'Average Heart Rate', 'Heart Rate', 'bpm'),
    'heartrate-peak': new ExerciseMeasurementType('heartrate-peak', 'Peak Heart Rate', 'Peak Heart Rate', 'bpm')
};

StrengthFarmModel.workoutPlans = {
    'core': new WorkoutPlan('Core', [
        new WorkoutExercise(StrengthFarmModel.exerciseTypes.pushup, [
            new ExerciseMeasurement(StrengthFarmModel.exerciseMeasurementTypes.repetition, 10) ] ),
        new WorkoutExercise(StrengthFarmModel.exerciseTypes.crunch, [
            new ExerciseMeasurement(StrengthFarmModel.exerciseMeasurementTypes.repetition, 30) ] ),
        new WorkoutExercise(StrengthFarmModel.exerciseTypes.curl, [
            new ExerciseMeasurement(StrengthFarmModel.exerciseMeasurementTypes.repetition, 5) ] )
        ]),
    'cardio': new WorkoutPlan('Cardio', [
        new WorkoutExercise(StrengthFarmModel.exerciseTypes.cycle,
            [ new ExerciseMeasurement(StrengthFarmModel.exerciseMeasurementTypes.duration, 20) ],
            [ new ExerciseCondition(new ExerciseCondition(StrengthFarmModel.exerciseMeasurementTypes.heartrate, 155)) ])
        ]),
    'private': new WorkoutPlan('Private', [
        new WorkoutExercise(StrengthFarmModel.exerciseTypes.intimacy, [
            new ExerciseMeasurement(StrengthFarmModel.exerciseMeasurementTypes.duration, 40)
        ])
    ])
};

StrengthFarmModel.workoutsToday = {
    'core': new Workout(StrengthFarmModel.workoutPlans.core),
    'cardio': new Workout(StrengthFarmModel.workoutPlans.cardio),
    'private': new Workout(StrengthFarmModel.workoutPlans.private)
}