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



const ThinVerticalDivider = styled(Divider)`
    width: 1px; // Ensure the divider is very thin
    background-color: gray; // Adjust the color as needed
    height: 100%; // Take full height of parent
`;
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
                    <Stack>
                        <Box width="100%" display="flex" justifyContent="space-between">
                            <Box width="32%" display="flex" justifyContent="center">
                                <BuyButtonMonthly planType={plan_type} />
                            </Box>
                            <Box width="2%" display="flex" justifyContent="center">
                                <Divider orientation={"vertical"}/>
                            </Box>

                            <Box width="32%" display="flex" justifyContent="center">
                                <BuyButtonYearly planType={plan_type} />
                            </Box>
                            <Box width="2%" display="flex" justifyContent="center">
                                <Divider orientation={"vertical"}/>
                            </Box>
                            <Box width="32%" display="flex" justifyContent="center">
                                <BuyOrganizational />
                            </Box>
                        </Box>
                        <Box>
                            <Divider />
                        </Box>
                        <Box>
                            <Typography>To change, cancel, or manage your plan, please contact: <b>support@speechbreeze.com</b></Typography>
                        </Box>
                    </Stack>


                </MainCard>
            </Grid>

            <Grid item xs={12}>
                <MainCard title={"Organization/School Employee"}>
                    <OrganizationInput />
                </MainCard>
            </Grid>
        </Grid>
  );
}