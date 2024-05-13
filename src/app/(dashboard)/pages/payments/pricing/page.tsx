'use client'
import MainCard from "@/components/MainCard";
import * as React from "react";
import {Box, Grid, Divider, Stack, Typography} from "@mui/material";
import BuyButtonComponent from "@/app/(dashboard)/pages/payments/pricing/BuyButtonMonthly";
import OrganizationInput from "@/app/(dashboard)/pages/payments/pricing/OrganizationInput";
import useUser from "@/hooks/useUser";
import BuyButtonMonthly from "@/app/(dashboard)/pages/payments/pricing/BuyButtonMonthly";
import BuyButtonYearly from "@/app/(dashboard)/pages/payments/pricing/BuyButtonYearly";
import BuyOrganizational from "@/app/(dashboard)/pages/payments/pricing/BuyOrganizational";
import {styled} from "@mui/material/styles";
// ==============================|| PAGE ||============================== //


export default function PricingPage() {
    const {user} = useUser();
    const plan_type = user?.sub_type!;
    let toDisable: Record<string, boolean> = {
        "1": false,
        "2": false,
        "3": false
    }

    if (typeof plan_type !== undefined && plan_type > 0) {
        toDisable["1"] = true;
        toDisable["2"] = true;
    }

  return (

        <Grid container spacing={1}>
            <Grid item xs={12}>
                <MainCard title="Plans">
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                        {/* Individual Plans */}
                        <Box width="66%">
                            <Typography variant="h4" align="center">Individual</Typography>  {/* Header for Individual Plans */}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box width="45%" display="flex" justifyContent="center">
                                    <BuyButtonMonthly planType={plan_type} />
                                </Box>
                                <Divider orientation="vertical" flexItem />  {/* Vertical Divider */}
                                <Box width="45%" display="flex" justifyContent="center">
                                    <BuyButtonYearly planType={plan_type} />
                                </Box>
                            </Box>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box width="34%">
                            <Typography variant="h4" align="center">Group Plans</Typography>
                            <Box display="flex" justifyContent="center">
                                <BuyOrganizational />
                            </Box>
                        </Box>
                    </Stack>

                    {/* Divider for Horizontal Layout */}
                    <Divider sx={{ mt: 2, mb: 2 }} />

                    {/* Footer with Support Information */}
                    <Box>
                        <Typography>
                            To change, cancel, or manage your plan, please contact: <b>support@speechbreeze.com</b>
                        </Typography>
                    </Box>
                </MainCard>
            </Grid>

            <Grid item xs={12}>
                <MainCard title={"Have an Access Code?"}>
                    <OrganizationInput />
                </MainCard>
            </Grid>
        </Grid>
  );
}