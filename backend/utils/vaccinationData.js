const standardVaccinationSchedule = [
    // Birth
    { name: 'BCG', ageInMonths: 0, description: 'Bacillus Calmette-Guérin' },
    { name: 'Hepatitis B (Birth Dose)', ageInMonths: 0, description: 'First dose at birth' },
    { name: 'OPV 0', ageInMonths: 0, description: 'Oral Polio Vaccine - Birth dose' },

    // 6 Weeks (1.5 months)
    { name: 'OPV 1', ageInMonths: 1.5, description: 'Oral Polio Vaccine - 1st dose' },
    { name: 'Pentavalent 1', ageInMonths: 1.5, description: 'DPT, Hepatitis B, Hib - 1st dose' },
    { name: 'Rotavirus 1', ageInMonths: 1.5, description: 'Rotavirus vaccine - 1st dose' },
    { name: 'PCV 1', ageInMonths: 1.5, description: 'Pneumococcal Conjugate Vaccine - 1st dose' },

    // 10 Weeks (2.5 months)
    { name: 'OPV 2', ageInMonths: 2.5, description: 'Oral Polio Vaccine - 2nd dose' },
    { name: 'Pentavalent 2', ageInMonths: 2.5, description: 'DPT, Hepatitis B, Hib - 2nd dose' },
    { name: 'Rotavirus 2', ageInMonths: 2.5, description: 'Rotavirus vaccine - 2nd dose' },
    { name: 'PCV 2', ageInMonths: 2.5, description: 'Pneumococcal Conjugate Vaccine - 2nd dose' },

    // 14 Weeks (3.5 months)
    { name: 'OPV 3', ageInMonths: 3.5, description: 'Oral Polio Vaccine - 3rd dose' },
    { name: 'Pentavalent 3', ageInMonths: 3.5, description: 'DPT, Hepatitis B, Hib - 3rd dose' },
    { name: 'Rotavirus 3', ageInMonths: 3.5, description: 'Rotavirus vaccine - 3rd dose' },
    { name: 'PCV 3', ageInMonths: 3.5, description: 'Pneumococcal Conjugate Vaccine - 3rd dose' },
    { name: 'IPV 1', ageInMonths: 3.5, description: 'Inactivated Polio Vaccine - 1st dose' },

    // 9 Months
    { name: 'Measles/MR 1', ageInMonths: 9, description: 'Measles/Rubella - 1st dose' },
    { name: 'Vitamin A (1st dose)', ageInMonths: 9, description: 'Vitamin A supplementation' },

    // 12 Months
    { name: 'PCV Booster', ageInMonths: 12, description: 'Pneumococcal booster' },

    // 15 Months
    { name: 'Chickenpox', ageInMonths: 15, description: 'Varicella vaccine' },
    { name: 'MMR', ageInMonths: 15, description: 'Measles, Mumps, Rubella' },

    // 16-18 Months
    { name: 'DPT Booster 1', ageInMonths: 16, description: 'DPT 1st booster' },
    { name: 'OPV Booster', ageInMonths: 16, description: 'OPV booster dose' },
    { name: 'IPV 2', ageInMonths: 16, description: 'Inactivated Polio Vaccine - 2nd dose' },
    { name: 'Measles/MR 2', ageInMonths: 16, description: 'Measles/Rubella - 2nd dose' },
    { name: 'Vitamin A (2nd dose)', ageInMonths: 18, description: 'Vitamin A supplementation' },

    // 24 Months (2 years)
    { name: 'Typhoid', ageInMonths: 24, description: 'Typhoid vaccine' },
    { name: 'Hepatitis A', ageInMonths: 24, description: 'Hepatitis A vaccine' },

    // 60 Months (5 years)
    { name: 'DPT Booster 2', ageInMonths: 60, description: 'DPT 2nd booster (5 years)' },

    // 108 Months (9 years)
    { name: 'HPV (for girls)', ageInMonths: 108, description: 'Human Papillomavirus (9 years)' },

    // 120 Months (10 years)
    { name: 'Tdap', ageInMonths: 120, description: 'Tetanus, Diphtheria, Pertussis (10 years)' }
];

export { standardVaccinationSchedule };