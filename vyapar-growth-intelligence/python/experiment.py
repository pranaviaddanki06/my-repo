"""Experimentation checklist for onboarding analysis."""
def experiment_readout(control_activation, treatment_activation, control_n, treatment_n):
    lift = treatment_activation - control_activation
    relative_lift = lift / control_activation if control_activation else None
    return {
        "absolute_lift": lift,
        "relative_lift": relative_lift,
        "sample_sizes": (control_n, treatment_n),
        "next_step": "Run a significance test and confidence interval before shipping."
    }
