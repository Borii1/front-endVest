// steps.js
import { Box, Typography, Grid } from "@mui/material";

const steps = [
    {   
        label: "Overview", 
        content: "Startup Vest is a dynamic platform designed to bridge the gap between startup owners seeking funding and investors looking for high-potential ventures. It offers a streamlined, user-friendly environment where entrepreneurs can present their companies, attract funding, and scale their businesses, while investors can explore and invest in startups that align with their interests." 
    },
    {   
        label: "Create Business Profile", 
        content: (
            <Box>
                <Typography variant="body1">
                    With StartUp Vest, you can create a detailed business profile as either a startup owner or an investor. 
                    <br /><br />Startup owners have the ability to set up and manage funding rounds for their ventures, while investors can explore and engage with promising opportunities. This dual functionality ensures that both sides of the investment equation are well-supported and connected.
                </Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                                Step 1: Click 'create' button and select business profile
                            </Typography>
                            <img src="/images/createbutton.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />
                            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                                Step 2: Click the profile you want to create
                            </Typography>
                            <img src="/images/chooseprofile.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />    
                    </Grid>

                    <Grid item xs={12} md={6}>
                            <Typography gutterBottom sx= {{ fontWeight: 'bold' }}>Startup Owner Form</Typography>
                            <img src="/images/startupForm.png" alt="Startup Owner" style={{ width: '100%', borderRadius: '8px' }} />
                            <Typography variant="body2" sx={{ mt: 1,  }}>
                                As a startup owner, you can create and manage funding rounds, track investment progress, and engage with potential investors to drive your startup's growth.
                            </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                            <Typography gutterBottom sx= {{ fontWeight: 'bold' }}>Investor Form</Typography>
                            <img src="/images/investorForm.png" alt="Investor" style={{ width: '100%', borderRadius: '8px' }} />
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                As an investor, you can explore various startup opportunities, evaluate potential investments, and track your portfolio's performance through a streamlined interface.
                            </Typography>
                    </Grid>
                </Grid>
            </Box>
        ) 
    },
    {   
        label: "Create Funding Round", 
        content: (
            <Box>
                <Typography variant="body1">
                    To create a funding round for your startup, you must first complete the setup of your business profile. This step is crucial as it ensures that all necessary details about your startup are in place and ready for potential investors to review.
                </Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                                Step 1: Click 'create' button and select funding round
                            </Typography>
                            <img src="/images/createbuttonF.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />
                            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                                Step 2: Fill up the form
                            </Typography>
                            <img src="/images/fundingForm.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />    
                    </Grid>
                </Grid>
            </Box>
        ) 
    },
];

export default steps;