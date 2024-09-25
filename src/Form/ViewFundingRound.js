import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem, Grid, FormControl, FormHelperText, Autocomplete } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

function ViewFundingRound({ fundingRoundDetails }) {
    const [startups, setStartups] = useState([]);
    const [selectedStartupId, setSelectedStartupId] = useState('');
    const [fundingType, setFundingType] = useState('');
    const [announcedMonth, setAnnouncedMonth] = useState('');
    const [announcedDay, setAnnouncedDay] = useState('');
    const [announcedYear, setAnnouncedYear] = useState('');
    const [closedMonth, setClosedMonth] = useState('');
    const [closedDay, setClosedDay] = useState('');
    const [closedYear, setClosedYear] = useState('');
    const [moneyRaised, setMoneyRaised] = useState(0);
    const [currency, setCurrency] = useState(''); // added currency state
    const [targetFunding, setTargetFunding] = useState('');
    const [preMoneyValuation, setPreMoneyValuation] = useState('');
    const [minimumShare, setMinimumShare] = useState('');
    const [formattedMoneyRaised, setFormattedMoneyRaised] = useState('');
    const [formattedTargetFunding, setFormattedTargetFunding] = useState('');
    const [formattedPreMoneyValuation, setFormattedPreMoneyValuation] = useState('');
    const [formattedMinimumShare, setFormattedMinimumShare] = useState('');


    //CAP TABLE
    const [allInvestors, setAllInvestors] = useState([]); // to store all fetched investors
    const [investors, setInvestors] = useState([{ name: null, title: '', shares: '' }]);
    const [errors, setErrors] = useState({});

    const days = [...Array(31).keys()].map(i => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => {
        return new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(2000, i, 1));
    });
    const years = [...Array(51).keys()].map(i => new Date().getFullYear() + i);

    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        console.log('Received Funding Round Details:', fundingRoundDetails); // Check the received data
    }, [fundingRoundDetails]);

    useEffect(() => {
        const fetchStartups = async () => {
            try {
                const response = await axios.get('http://localhost:3000/startups', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setStartups(response.data);
            } catch (error) {
                console.error('Error fetching startups:', error);
            }
        };

        const fetchInvestors = async () => {
            try {
                const response = await axios.get('http://localhost:3000/investors/All', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setAllInvestors(response.data);
            } catch (error) {
                console.error('Error fetching investors:', error);
            }
        };

        fetchStartups();
        fetchInvestors();
        console.log(allInvestors);
    }, []);

    const validateYears = () => {
        const newErrors = {};

        // Check if closedYear is earlier than announcedYear
        if (announcedYear && closedYear && parseInt(closedYear) < parseInt(announcedYear)) {
            newErrors.closedYear = 'Closed year can\'t be before announced year.';
        }

        // If the years are the same, check the months and days
        if (announcedYear && closedYear && parseInt(closedYear) === parseInt(announcedYear)) {
            if (closedMonth < announcedMonth) {
                newErrors.closedMonth = 'Closed month can\'t be before announced month.';
            } else if (closedMonth === announcedMonth && closedDay < announcedDay) {
                newErrors.closedDay = 'Closed day can\'t be before announced day.';
            }
        }

        // Check if targetFunding and preMoneyValuation are empty
        if (!targetFunding) {
            newErrors.targetFunding = 'Target funding cannot be empty.';
        }

        if (!preMoneyValuation) {
            newErrors.preMoneyValuation = 'Pre-money valuation cannot be empty.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInvestorChange = (index, field, value) => {
        const updatedInvestors = [...investors];
        updatedInvestors[index][field] = value;
        setInvestors(updatedInvestors);
    };

    const handleAddInvestor = () => {
        setInvestors([...investors, { name: '', title: '', shares: '' }]);
    };

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const unformatNumber = (str) => {
        return str.replace(/,/g, '');
    };

    const handleSharesChange = (index, value) => {
        const unformattedValue = unformatNumber(value);
        if (!isNaN(unformattedValue) || unformattedValue === '') {
            const updatedInvestors = [...investors];
            updatedInvestors[index] = {
                ...updatedInvestors[index],
                shares: unformattedValue, // Store the actual numeric value
                formattedShares: formatNumber(unformattedValue) // Store the formatted value for display
            };
            setInvestors(updatedInvestors);
        }
    };

    const handleNumberChange = (setter) => (e) => {
        const value = e.target.value;
        const unformattedValue = unformatNumber(value);
        if (!isNaN(unformattedValue) || unformattedValue === '') {
            setter(formatNumber(unformattedValue));
        }
    };

    // Initialize the investors state with existing investors
    useEffect(() => {
        if (fundingRoundDetails) {
            setSelectedStartupId(fundingRoundDetails.startup.id);
            setFundingType(fundingRoundDetails.fundingType);
            setTargetFunding(fundingRoundDetails.targetFunding);
            setPreMoneyValuation(fundingRoundDetails.preMoneyValuation);
            setCurrency(fundingRoundDetails.moneyRaisedCurrency);
            setMoneyRaised(fundingRoundDetails.moneyRaised);
            setMinimumShare(fundingRoundDetails.minimumShare);
            setFormattedMoneyRaised(formatNumber(fundingRoundDetails.moneyRaised));
            setFormattedTargetFunding(formatNumber(fundingRoundDetails.targetFunding));
            setFormattedPreMoneyValuation(formatNumber(fundingRoundDetails.preMoneyValuation));
            setFormattedMinimumShare(formatNumber(fundingRoundDetails.minimumShare));

            const announcedDate = new Date(fundingRoundDetails.announcedDate);
            setAnnouncedDay(announcedDate.getDate());
            setAnnouncedMonth(announcedDate.getMonth() + 1); // getMonth() is zero-based
            setAnnouncedYear(announcedDate.getFullYear());
    
            // Initialize closedDate state variables
            const closedDate = new Date(fundingRoundDetails.closedDate);
            setClosedDay(closedDate.getDate());
            setClosedMonth(closedDate.getMonth() + 1); // getMonth() is zero-based
            setClosedYear(closedDate.getFullYear());
        }

        if (fundingRoundDetails?.capTableInvestors) {
            const existingInvestors = fundingRoundDetails.capTableInvestors.map(investor => ({
                name: investor.investor.id, // Assuming this is the investor ID
                title: investor.title,
                shares: investor.shares.toString(), // Ensure it's a string
                formattedShares: formatNumber(investor.shares.toString()) // Add formatted version for display
            }));
            setInvestors(existingInvestors);
        }
    }, [fundingRoundDetails]);

    const handleUpdateFundingRound = async () => {
        if (!validateYears()) {
            return; // Exit if validation fails
        }

        try {
            const updatedInvestors = investors.map(investor => ({
                id: investor.name,  // Assuming this is the investor ID 
                title: investor.title,
                shares: parseInt(unformatNumber(investor.shares))
            }));
    
            const updatePayload = {
                updateData: {
                    startup: { id: selectedStartupId },
                    fundingType,
                    announcedDate: `${announcedYear}-${String(announcedMonth).padStart(2, '0')}-${String(announcedDay).padStart(2, '0')}`,
                    closedDate: `${closedYear}-${String(closedMonth).padStart(2, '0')}-${String(closedDay).padStart(2, '0')}`,
                    moneyRaised: parseInt(unformatNumber(formattedMoneyRaised)),
                    moneyRaisedCurrency: currency,
                    targetFunding: parseInt(unformatNumber(formattedTargetFunding)),
                    preMoneyValuation: parseInt(unformatNumber(formattedPreMoneyValuation)),
                    minimumShare: parseFloat(unformatNumber(formattedMinimumShare)),
                },
                investors: updatedInvestors
            };
    
            const response = await axios.put(`http://localhost:3000/funding-rounds/${fundingRoundDetails.id}`, updatePayload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            console.log('Funding round updated successfully:', response.data);
        } catch (error) {
            console.error('Failed to update funding round:', error);
        }
        setIsEditMode(false);
    };

    const handleRemoveInvestor = (index) => {
        const updatedInvestors = [...investors];
        updatedInvestors.splice(index, 1);
        setInvestors(updatedInvestors);
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, width: '100%', overflowX: 'hidden', maxWidth: '1000px', background: '#F2F2F2' }}>
            <Typography variant="h5" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pt: 3, pb: 3 }}>
                Organization
            </Typography>

            <Grid container spacing={3} sx={{ ml: 2 }}>
                <Grid item xs={12} sm={11}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                        <label>StartUp Name</label>    
                        <FormControl fullWidth variant="outlined">
                            <Select
                                fullWidth
                                variant="outlined"
                                value={fundingRoundDetails ? fundingRoundDetails.startup.id : selectedStartupId}
                                onChange={(e) => setSelectedStartupId(e.target.value)}
                                disabled={!!fundingRoundDetails}
                                sx={{ height: '45px' }}>
                                {startups.map((startup) => (
                                    <MenuItem key={startup.id} value={startup.id}>{startup.companyName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Typography variant="h5" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pt: 3, pb: 1 }}>
                Funding Round Details
            </Typography>

            <Grid container spacing={3} sx={{ ml: 2 }}>
                <Grid item xs={12} sm={11}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                        <label>Funding Type</label> 
                            <FormControl fullWidth variant="outlined">
                                <Select fullWidth variant="outlined" value={fundingType} onChange={(e) => setFundingType(e.target.value)} disabled={!!fundingRoundDetails} sx={{ height: '45px' }}>
                                    <MenuItem value={'Pre-Seed'}>Pre-Seed</MenuItem>
                                    <MenuItem value={'Seed'}>Seed</MenuItem>
                                    <MenuItem value={'Series A'}>Series A</MenuItem>
                                    <MenuItem value={'Series B'}>Series B</MenuItem>
                                    <MenuItem value={'Series C'}>Series C</MenuItem>
                                    <MenuItem value={'Series D'}>Series D</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <label><b>Announced Date</b><br />Month</label>
                            <FormControl fullWidth variant="outlined">
                                <Select labelId="month-label" value={announcedMonth} onChange={(e) => setAnnouncedMonth(e.target.value)} sx={{ height: '45px' }} disabled>
                                    {months.map((month, index) => (
                                        <MenuItem key={index} value={index + 1}>{month}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <label><br />Day</label>
                            <FormControl fullWidth variant="outlined">
                                <Select labelId="day-label" value={announcedDay} onChange={(e) => setAnnouncedDay(e.target.value)} 
                                sx={{ height: '45px' }} disabled>
                                    {days.map((day) => (
                                        <MenuItem key={day} value={day}>{day}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <label><br />Year</label>
                            <FormControl fullWidth variant="outlined">
                                <Select labelId="year-label" value={announcedYear} onChange={(e) => setAnnouncedYear(e.target.value)} sx={{ height: '45px' }} disabled>
                                    {years.map((year) => (
                                        <MenuItem key={year} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <label><b>Closed on Date</b><br />Month</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.closedMonth}>
                                <Select labelId="month-label" value={closedMonth} onChange={(e) => setClosedMonth(e.target.value)} disabled={!isEditMode} sx={{ height: '45px' }}>
                                    {months.map((month, index) => (
                                        <MenuItem key={index} value={index + 1}>{month}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {errors.closedMonth && <FormHelperText>{errors.closedMonth}</FormHelperText>}
                        </Grid>

                        <Grid item xs={4}>
                            <label><br />Day</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.closedDay}>
                                <Select labelId="day-label" value={closedDay} onChange={(e) => setClosedDay(e.target.value)} disabled={!isEditMode} sx={{ height: '45px' }}>
                                    {days.map((day) => (
                                        <MenuItem key={day} value={day}>{day}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {errors.closedDay && <FormHelperText>{errors.closedDay}</FormHelperText>}
                        </Grid>

                        <Grid item xs={4}>
                            <label><br />Year</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.closedYear}>
                                <Select labelId="year-label" value={closedYear} onChange={(e) => setClosedYear(e.target.value)} disabled={!isEditMode} sx={{ height: '45px' }}>
                                    {years.map((year) => (
                                        <MenuItem key={year} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {errors.closedYear && <FormHelperText>{errors.closedYear}</FormHelperText>}
                        </Grid>

                        <Grid item xs={8}>
                            <label>Money Raised Amount</label>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={formattedMoneyRaised}
                                onChange={handleNumberChange(setFormattedMoneyRaised)}
                                disabled
                                sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }} />
                        </Grid>

                        <Grid item xs={4}>
                            <label>Currency</label>
                            <Select
                                fullWidth
                                variant="outlined"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                disabled
                                sx={{ height: '45px' }}>
                                <MenuItem value="₱">PESO</MenuItem>
                                <MenuItem value="$">USD</MenuItem>
                                <MenuItem value="€">EUR</MenuItem>
                                <MenuItem value="£">GBP</MenuItem>
                                <MenuItem value="¥">JPY</MenuItem>
                                <MenuItem value="₩">KRW</MenuItem>
                            </Select>
                        </Grid>

                        <Grid item xs={8}>
                            <label>Target Funding Amount</label>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={formattedTargetFunding}
                                onChange={handleNumberChange(setFormattedTargetFunding)}
                                disabled={!isEditMode}
                                sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                error={!!errors.targetFunding} />
                            {errors.targetFunding && (
                                <FormHelperText error>{errors.targetFunding}</FormHelperText>
                            )}
                        </Grid>

                        <Grid item xs={4}>
                            <label>Currency</label>
                            <Select
                                fullWidth
                                variant="outlined"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                disabled={!isEditMode}
                                sx={{ height: '45px' }}>
                                <MenuItem value="₱">PESO</MenuItem>
                                <MenuItem value="$">USD</MenuItem>
                                <MenuItem value="€">EUR</MenuItem>
                                <MenuItem value="£">GBP</MenuItem>
                                <MenuItem value="¥">JPY</MenuItem>
                                <MenuItem value="₩">KRW</MenuItem>
                            </Select>
                        </Grid>

                        <Grid item xs={12}>
                            <label>Pre-Money Valuation</label>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={formattedPreMoneyValuation}
                                onChange={handleNumberChange(setFormattedPreMoneyValuation)}
                                disabled={!isEditMode}
                                sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                error={!!errors.preMoneyValuation}/>
                            {errors.preMoneyValuation && (
                                <FormHelperText error>{errors.preMoneyValuation}</FormHelperText>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Typography sx={{ color: '#007490'}}>
                            The price per share refers to the amount of money you need to pay to purchase one share of a company's stock. For example, if the price per share is P10,000, you would need to invest P10,000 to acquire a single share in that company.
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={8}>
                            <label>Price per Share</label>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={formattedMinimumShare}
                                onChange={handleNumberChange(setFormattedMinimumShare)}
                                disabled
                                sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                        </Grid>

                        <Grid item xs={4}>
                            <label>Currency</label>
                            <Select
                                fullWidth
                                variant="outlined"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                disabled
                                sx={{ height: '45px' }}>
                                <MenuItem value="₱">PESO</MenuItem>
                                <MenuItem value="$">USD</MenuItem>
                                <MenuItem value="€">EUR</MenuItem>
                                <MenuItem value="£">GBP</MenuItem>
                                <MenuItem value="¥">JPY</MenuItem>
                                <MenuItem value="₩">KRW</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Typography variant="h5" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pt: 3, pb: 3 }}>
                Investors to this Funding Round
            </Typography>

            <Grid container spacing={3} sx={{ ml: 2 }}>
                {investors.map((investor, index) => (
                    <Grid item xs={12} sm={11} key={index}>
                        <Grid container spacing={2}>
                            
                            <Grid item xs={4}>
                                <label>Shareholder Name</label>
                                <FormControl fullWidth variant="outlined">
                                    <Autocomplete disablePortal options={allInvestors}
                                        sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                                        value={allInvestors.find(inv => inv.id === investor.name) || null}
                                        onChange={(event, newValue) => handleInvestorChange(index, 'name', newValue ? newValue.id : '')}
                                        disabled={!isEditMode}
                                        renderInput={(params) => (
                                        <TextField  {...params} variant="outlined" />
                                        )}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}/>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={4}>
                                <label>Title</label>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={investor.title}
                                    onChange={(e) => handleInvestorChange(index, 'title', e.target.value)}
                                    disabled={!isEditMode}
                                    sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }} />
                            </Grid>
                            
                            <Grid item xs={3.5}>
                                <label>Shares</label>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={investor.formattedShares} // Use the formatted value for display
                                    onChange={(e) => handleSharesChange(index, e.target.value)}
                                    disabled={!isEditMode}
                                    sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                />
                            </Grid>

                            <Grid item xs={.5}>
                                {investors.length > 0 && isEditMode && (
                                    <IconButton 
                                        sx = {{ mt: 3 }}
                                        color="error" 
                                        onClick={() => handleRemoveInvestor(index)}
                                        aria-label="remove"> 
                                        <CloseIcon />
                                    </IconButton>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                ))}
                <Grid item xs={12} sm={11}>
                    <Button variant="outlined" sx={{ color: 'rgba(0, 116, 144, 1)', borderColor: 'rgba(0, 116, 144, 1)', '&:hover': { color: 'rgba(0, 116, 144, 0.7)', borderColor: 'rgba(0, 116, 144, 0.7)' } }} onClick={handleAddInvestor} disabled={!isEditMode}>
                        Add Investor
                    </Button>
                </Grid>
            </Grid>

            <Button variant="contained"
                sx={{ width: 150, background: 'rgba(0, 116, 144, 1)', '&:hover': { boxShadow: '0 0 10px rgba(0,0,0,0.5)', backgroundColor: 'rgba(0, 116, 144, 1)' } }} style={{marginLeft: '80%'}}
                onClick={() => { 
                    const action = isEditMode ? handleUpdateFundingRound : toggleEditMode;
                        action(); 
                        action(); 
                  }}>
                {isEditMode ? 'Save Changes' : 'Edit Funding'}
            </Button>
        </Box>
    );
}

export default ViewFundingRound;