/**
 * @copyright 2020 Asmov LLC
 */
'use strict';

import DomViewEngine from 'js/ext/domview/DomViewEngine.mjs';
import StrengthFarmModel from 'js/StrengthFarmModel.mjs';

export default function index() {
    new DomViewEngine().init('index').then((indexTemplate) => {
        const dailyTemplate = indexTemplate.getTemplate('daily');

        for (let workoutName in StrengthFarmModel.workoutsToday) {
            let workoutPlan = StrengthFarmModel.workoutsToday[workoutName];
            let workoutTemplate = dailyTemplate.addTemplate('daily/workout');
            workoutTemplate.bindValues({
                'title': workoutPlan.getName(),
            });

            let exercises = workoutPlan.getExercises();
            for (let i = 0; i < exercises.length; ++i) {
                let exercise = exercises[i];
                let exerciseTemplate = workoutTemplate.addTemplate('daily/workout/exercise');
                exerciseTemplate.bindValues({
                    'title': exercise.getName(),
                    'image': { attr: { src: 'img/foo.png' } },
                    'goal': exercise.getGoal(),
                    'done': exercise.getDone(),
                    'input': exercise.getDefaultReps()
                });
            }
        }

        indexTemplate.refresh();
    });
};