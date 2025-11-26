import {type ActionFunctionArgs} from '@shopify/remix-oxygen';

export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({error: 'Method not allowed'}), {
      status: 405,
      headers: {'Content-Type': 'application/json'},
    });
  }

  try {
    const body = await request.json() as {email?: string};
    const {email} = body;

    // Validate email exists
    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({error: 'E-postadress krävs'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'},
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({error: 'Ogiltig e-postadress'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'},
      });
    }

    const {storefront} = context;

    // Create customer with email marketing consent
    const mutation = `
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            emailMarketingConsent {
              marketingState
              marketingOptInLevel
            }
          }
          customerUserErrors {
            field
            message
            code
          }
        }
      }
    `;

    const variables = {
      input: {
        email: email.toLowerCase().trim(),
        acceptsMarketing: true,
        emailMarketingConsent: {
          marketingState: 'SUBSCRIBED',
          marketingOptInLevel: 'SINGLE_OPT_IN',
        },
      },
    };

    const response: any = await storefront.mutate(mutation, {variables});

    // Check for errors
    if (response.customerCreate?.customerUserErrors?.length > 0) {
      const errors = response.customerCreate.customerUserErrors;
      const firstError = errors[0];
      
      // If email is already taken, treat as success
      if (firstError.code === 'TAKEN') {
        return new Response(
          JSON.stringify({
            success: true, 
            message: 'Tack! Du är redan registrerad för vårt nyhetsbrev.'
          }),
          {
            status: 200,
            headers: {'Content-Type': 'application/json'},
          }
        );
      }

      // Handle other errors
      console.error('Customer creation errors:', errors);
      return new Response(
        JSON.stringify({
          error: firstError.message || 'Något gick fel. Försök igen.'
        }),
        {
          status: 400,
          headers: {'Content-Type': 'application/json'},
        }
      );
    }

    // Success - customer created with marketing consent
    if (response.customerCreate?.customer) {
      console.log('Newsletter signup successful:', {
        email: response.customerCreate.customer.email,
        customerId: response.customerCreate.customer.id,
        marketingState: response.customerCreate.customer.emailMarketingConsent?.marketingState,
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Tack för att du registrerade dig! Välkommen till Klosslabbet-familjen.'
        }),
        {
          status: 200,
          headers: {'Content-Type': 'application/json'},
        }
      );
    }

    // Unexpected response structure
    console.error('Unexpected mutation response:', response);
    return new Response(
      JSON.stringify({error: 'Något gick fel. Försök igen.'}),
      {
        status: 500,
        headers: {'Content-Type': 'application/json'},
      }
    );

  } catch (error) {
    console.error('Newsletter signup error:', error);
    return new Response(
      JSON.stringify({error: 'Ett oväntat fel inträffade. Försök igen senare.'}),
      {
        status: 500,
        headers: {'Content-Type': 'application/json'},
      }
    );
  }
}